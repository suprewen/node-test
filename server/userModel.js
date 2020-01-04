const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    require: true
  },
  gender: {
    type: Number,
    enum: [0, 1],
    default: 0,
    require: true
  },
  age: {
    type: Number
  },
  email: {
    type: String,
    require: true
  },
  note: {
    type: String
  }
})

module.exports = mongoose.model('User', UserSchema)