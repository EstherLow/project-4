const mongoose = require('mongoose')
const Participant = require("../models/participant")
const Quiz = require("../models/quiz")
const Question = require("../models/question")
const User = require("../models/user")

const livequizSchema = new mongoose.Schema({
  quiz_id: {type: mongoose.Schema.Types.ObjectId, ref:'Quiz'},
  question_id: {type: mongoose.Schema.Types.ObjectId, ref:'Question'},
  launched_by: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  code: {type: String},
})

livequizSchema.pre('save', function (next) {
  var livequiz = this;
  var objId = livequiz._id
  livequiz.code = objId.toString().substring(20, 24)
  console.log("livequiz code is " + livequiz.code);
  next()

})

const Livequiz = mongoose.model('Livequiz', livequizSchema)

module.exports = {
  model: Livequiz,
  schema: livequizSchema
}
