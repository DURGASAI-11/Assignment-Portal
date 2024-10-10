const express = require('express')

const linkedInRouter = express.Router()
const { linkedinCallback } = require('../Controllers/LinkedinController')

//linkedin callback function (accesstoken ,userinfo api access)
//it triggers when login(admin or user) or register(admin or user) hits
linkedInRouter.get('/callback', linkedinCallback)

module.exports = linkedInRouter
