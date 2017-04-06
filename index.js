const path = require('path')
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const expressVue = require('express-vue')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose')
const quizzes_controller = require('./controllers/quizzes_controller')
const questions_controller = require('./controllers/questions_controller')
const http  = require('http').createServer(app)
const io = require('socket.io')(http)

const Participant = require('./models/participant').model
const Question = require('./models/question').model
const Livequiz = require('./models/livequiz').model
const Response = require('./models/response').model

const qn = require('./routes/question')
const quiz = require('./routes/quiz')
const livequiz = require('./routes/livequiz')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/quizzit')
mongoose.Promise = global.Promise;





app.engine('vue', expressVue)
app.set('view engine', 'vue')
// app.set('views', path.join(_dirname, '/views'))
// app.set('vue', {
//   componentsDir: path.join(_dirname,
//   '/views/components'),
//   defaultLayout: 'layout'
// })

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(ejsLayouts)
app.use(methodOverride('_method'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))

app.use('/question', qn)
app.use('/quiz', quiz)
app.use('/livequiz', livequiz)


app.get('/', quizzes_controller.listAllQuiz)

app.get('/dashboard', function (req, res) {
  res.render('dashboard')
})

app.get('/game', function (req, res) {
  res.render('game')
})

app.get('/live/response', function(req, res) {
  res.render('response')
})

app.get('/quizzes/:id/launch.html', function(req, res) {
  res.render('game')
})





//websocket functions

let users = []

io.on('connect', function(socket) {
  console.log("A user connected " + socket.id);
//tell all clients that someone connected
  //io.emit('user joined', namespace)

  socket.on('send username', function(data){
    let userdata = data
    //set socket
    socket.room = userdata.room
    socket.username = userdata.username
    socket.join(userdata.room)
    socket.broadcast.to(userdata.room)

    Participant.create({username: userdata.username, socket_id: socket.id, livequiz_id: userdata.room}, function (err, created) {
      if (err) { return console.log(err) }
      Participant.find({livequiz_id: userdata.room}, function (err, participants) {
        if (err) { return console.log(err) }
        io.sockets.in(userdata.room).emit("user joined", {participants: participants})
      })
    })
    console.log("user room", userdata.room);
    })

    socket.on('start quiz', function (data) {
      console.log('start', data);
      io.sockets.in(data).emit('quiz started')
    })


    socket.on('send response', function(data){
      let room = data.userroom
      console.log('send response data', data);
      Response.create({participant: data.username, option: data.response, isAnswer: data.isAnswer}, function (err, response){
        if (err) { console.log(err) };
        console.log("index js response", response);
        io.sockets.in(room).emit('response sent', {response: response})
      })
    })

    socket.on('next question', function(data){
      let room = data.userroom
      let index = data.index
      console.log('nextquestion', data);
      io.sockets.in(room).emit('response sent', index)
    })

       socket.on('disconnect', function() {
         let room = socket.room
         let user = socket.name
         Participant.remove({socket_id: socket.id}, function(err) {
           if (err) { return console.log(err) }
           Livequiz.remove({code: socket.room}, function (err) {
             if (err) { return console.log(err) }
             io.sockets.in(room).emit('left room', user)
           })
         })
       })

})




var server = http.listen(process.env.PORT || 3000)
console.log('Server UP')

module.exports = server
