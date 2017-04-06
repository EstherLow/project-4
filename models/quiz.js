const mongoose = require('mongoose')
const User = require("../models/user")
const Question = require("../models/question")

const quizSchema = new mongoose.Schema({
  name: {type: String},
  instructions: {type: String},
  created_by: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  questions: [{type: mongoose.Schema.Types.ObjectId, ref:'Question'}]
})

quizSchema.pre('save', function (next) {
  var quiz = this;
  var objId = quiz._id
  quiz.code = objId.toString().substring(20, 24)
  console.log("quiz code is " + quiz.code);
  next()

})

const Quiz = mongoose.model('Quiz', quizSchema)

module.exports = {
  model: Quiz,
  schema: quizSchema
}
