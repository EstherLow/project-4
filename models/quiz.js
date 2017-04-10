const mongoose = require('mongoose')
const User = require("../models/user")
const Question = require("../models/question")

const quizSchema = new mongoose.Schema({
  name: {type: String},
  instructions: {type: String},
  created_by: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  questions: [{type: mongoose.Schema.Types.ObjectId, ref:'Question'}]
})

const Quiz = mongoose.model('Quiz', quizSchema)

module.exports = {
  model: Quiz,
  schema: quizSchema
}
