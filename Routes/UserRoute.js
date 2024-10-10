const express = require('express')
const {
  uploadAssignment,
  fetchAdmins,
} = require('../Controllers/UserController')
const { getLoginPage } = require('../Controllers/LinkedinController')
const { authenticateUser } = require('../Middlewares/auth')

const userRouter = express.Router()
const setRole = (role) => {
  return (req, res, next) => {
    req.role = role // Attach the role to the request object
    next() // Continue to the next middleware or route handler
  }
}
// User login
userRouter.get('/login', setRole('user'), getLoginPage)

// Register a new user
userRouter.get('/register', setRole('user'), getLoginPage)

// Upload assignment (only for authenticated users)
userRouter.post('/upload', authenticateUser, uploadAssignment)

// Fetch all admins
userRouter.get('/admins', authenticateUser, fetchAdmins)

module.exports = userRouter
