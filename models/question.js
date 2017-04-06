const mongoose = require('mongoose')
const Quiz = require("../models/quiz")


const optionSchema = new mongoose.Schema({
  content: {type: String},
  isAnswer: {type: Boolean, default: false}
})


const questionSchema = new mongoose.Schema({
  qn_type: {type: String},
  stem: {type: String},
  points: {type: Number, default: 1},
  quiz_id: [{type: mongoose.Schema.Types.ObjectId, ref:'Quiz'}],
  options: [optionSchema]
})


const Question = mongoose.model('Question', questionSchema)

module.exports = {
  model: Question,
  schema: questionSchema
}
