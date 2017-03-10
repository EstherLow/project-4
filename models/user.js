const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {type: String},
  email: {type: String},
  pwd: {type: Number},
})

const User = mongoose.model('User', userSchema)

module.exports = {
  model: User,
  schema: userSchema
}
