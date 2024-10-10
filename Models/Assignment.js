const mongoose = require('mongoose')
const assignmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  task: {
    type: String,
    required: [true, 'Task is required'],
    trim: true,
    minlength: [1, 'Task cannot be empty'],
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Admin ID is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
    required: [true, 'Status is required'],
  },
  createdAt: { type: Date, default: Date.now },
})

const Assignment = mongoose.model('Assignment', assignmentSchema)

module.exports = Assignment
