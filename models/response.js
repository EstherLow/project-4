const mongoose = require('mongoose')


const responseSchema = new mongoose.Schema({
  participant: {type: String},
  option: {type: String},
  isAnswer: {type: Boolean, default: false}
})

const Response = mongoose.model('Response', responseSchema)

module.exports = {
  model: Response,
  schema: responseSchema
}
