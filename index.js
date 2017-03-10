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





app.get('/quizzes/new', function (req, res) {
    res.render('quizzes/new')
})

app.get('/game', function (req, res) {
  res.render('game')
})

app.post('/quizzes', quizzes_controller.addQuiz)  // add new quiz

app.get('/quizzes/:id/live', quizzes_controller.showLiveQuiz)  // show view of individual live quiz

app.get('/quizzes/:id', quizzes_controller.editQuiz)  //show edit form for 1 quiz

app.get('/quiz/:id', quizzes_controller.showQuiz)

app.post('/quizzes/:id', quizzes_controller.updateQuiz)

app.get('/quizzes/:id/questions/new', questions_controller.new)  // add new questions to created quiz

app.post('/questions', questions_controller.createQuestion)

app.get('/dashboard', quizzes_controller.listAllQuiz)

app.get('/live/response', function(req, res) {
  res.render('response')
})

app.get('/quizzes/:id/launch.html', function(req, res) {
  res.render('game')
})

app.get('/scoreboard', quizzes_controller.liveQuizScoreboard)

app.get('/quizzes/:id/game', quizzes_controller.showLiveQuiz2)




//websocket functions

io.on('connect', function(socket) {
  console.log("A user connected " + socket.id);
  users = []
//tell all clients that someone connected
  //io.emit('user joined', namespace)

  socket.on('send response', function(data){
    let index = data
      Question.find({'options._id': data}, function (err, response) {
          var options = response[0].options

          if (response.isAnswer == true)  {
          answer = 'This is correct'
          console.log("if 1: ", answer);
          } else {
            answer = 'This is wrong'
            console.log("else ", answer);
          }
        })
        console.log();
        io.emit("assess answer")
     })

  socket.on('send username', function(data){
    let userdata = data
    users.push(userdata.username)
    Participant.create({username: userdata.username, socket_id: socket.id, quiz_id: userdata.room})
    socket.room = userdata.room
    socket.username = userdata.username
    socket.join(userdata.room)
    socket.broadcast.to('room1')
    io.emit("user joined", users)
    })

})




var server = http.listen(process.env.PORT || 3000)
console.log('Server UP')

module.exports = server
