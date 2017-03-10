const mongoose = require('mongoose')
const Participant = require("../models/participant")
const Quiz = require("../models/quiz")
const Question = require("../models/question")


const responseSchema = new mongoose.Schema({
  participant_id: {type: mongoose.Schema.Types.ObjectId, ref:'Participant'},
  quiz_id: {type: mongoose.Schema.Types.ObjectId, ref:'Quiz'},
  question_id: {type: mongoose.Schema.Types.ObjectId, ref:'Question'},
  option_id: {type: mongoose.Schema.Types.ObjectId, ref:'Question'},
  score_awarded: {type: Number}
})

const User = mongoose.model('Participant', participantSchema)

module.exports = {
  model: Participant,
  schema: participantSchema
}
