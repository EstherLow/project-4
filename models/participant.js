const mongoose = require('mongoose')

const participantSchema = new mongoose.Schema({
  username: {type: String},
  socket_id: {type: String},
  livequiz_id: {type: String}
})

const Participant = mongoose.model('Participant', participantSchema)

module.exports = {
  model: Participant,
  schema: participantSchema
}
