const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    required: [true, 'Role is required'],
  },
  linkedinId: {
    type: String,
    required: [true, 'LinkedIn ID is required'],
  },
})

const Users = mongoose.model('Users', UserSchema)

module.exports = Users
