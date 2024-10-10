const express = require('express')
const adminRouter = express.Router()
const {
  viewAssignments,
  acceptAssignment,
  rejectAssignment,
} = require('../Controllers/AdminController')
const { getLoginPage } = require('../Controllers/LinkedinController')
const { authenticateAdmin } = require('../Middlewares/auth')

// Register a new admin
const setRole = (role) => {
  return (req, res, next) => {
    req.role = role // Attach the role to the request object
    next() // Continue to the next middleware or route handler
  }
}

// Admin register route
adminRouter.get('/register', setRole('admin'), getLoginPage)

//Admin login route
adminRouter.get('/login', setRole('admin'), getLoginPage)

//authentication middleware
adminRouter.use(authenticateAdmin)

// View assignments tagged to admin
adminRouter.get('/assignments', viewAssignments)

// Accept an assignment
adminRouter.post('/assignments/:id/accept', acceptAssignment)

// Reject an assignment
adminRouter.post('/assignments/:id/reject', rejectAssignment)

module.exports = adminRouter
