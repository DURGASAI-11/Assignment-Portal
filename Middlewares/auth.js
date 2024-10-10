const jwt = require('jsonwebtoken')

// Middleware to authenticate users
const authenticateUser = (req, res, next) => {
  // header contains Authorization
  //it contains Bearer wioerijdnfdifji87efdiufhdhfudfhdujhfdhfd so we replacing the bearer with empty .

  try {
    const token = req.header('Authorization').replace('Bearer ', '')

    // we can verify the token is valid or not using jwt.verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET) // it checks the secret key is present in the token or not
    req.user = decoded.user //assigning user data to req so apis can access the user details in req
    next()
  } catch (err) {
    res.status(401).json({ error: 'Please authenticate.' })
  }
}

// Middleware for admin role checking

const authenticateAdmin = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET) // it checks the secret key is present in the token or not
    req.user = decoded.user //assigning user data to req so apis can access the user details in req

    if (req.user.role !== 'admin') {
      return res.status(403).send({ error: 'Access forbidden.' })
    }
    next()
  } catch (err) {
    res.status(401).send({ error: 'Please authenticate.' })
  }
}

module.exports = { authenticateUser, authenticateAdmin }
