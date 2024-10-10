const axios = require('axios')
const jwt = require('jsonwebtoken')
//these are clientid and secrectid and callback url (which triggers accesstoken and userInfo apis) and jwt secrect (helps to create token)
//all the above things are confidential so i have stored in .env file and extracting using process.env
const {
  LINKEDIN_CLIENT_ID,
  LINKEDIN_CLIENT_SECRET,
  LINKEDIN_PURL,
  JWT_SECRET,
} = process.env
const User = require('../Models/User')

//Request Authorization code (LinkedInAuthUrl)
// The user is directed to LinkedIn’s login page by hitting the LinkedIn authorization URL.
//  This URL includes important query parameters:
// client_id,redirecturi,and role
//we will get code=AUTHORIZATION_CODE&role=user (the authorization code is important )
module.exports.getLoginPage = async (req, res) => {
  try {
    const linkedinAuthUrl =
      'https://www.linkedin.com/oauth/v2/authorization' +
      `?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(
        process.env.LINKEDIN_PURL + `?role=${req.role}`,
      )}` +
      `&scope=openid%20profile%20email`

    res.redirect(linkedinAuthUrl)
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: 'Error initiating LinkedIn authentication' })
  }
}
//after triggering the callback we need to hit the linkedin accesstoken api with  authorization code
//now it will give you access token ,now need to hit userinfo api with  access token
//now it will get user details
exports.linkedinCallback = async (req, res) => {
  try {
    const { code, role } = req.query // authorization code and role

    // Exchange the authorization code for an access token
    console.log(`${LINKEDIN_PURL}?role=${role}`)
    const tokenResponse = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      null,
      {
        params: {
          grant_type: 'authorization_code',
          code: code,
          client_id: LINKEDIN_CLIENT_ID,
          client_secret: LINKEDIN_CLIENT_SECRET,
          redirect_uri: `${process.env.LINKEDIN_PURL}?role=${role}`,
        },
      },
    )
    // console.log('accessToken', tokenResponse)
    const accessToken = tokenResponse.data.access_token

    // request to LinkedIn's API to get the user's info
    const response = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    console.log('response', response.status)

    if (response.status === 200) {
      const linkedinUserData = response.data

      // Check if the user is already registered in your MongoDB
      const existingUser = await User.findOne({
        linkedinId: linkedinUserData.sub,
      })

      const cookieOptions = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
      }

      if (existingUser) {
        let token = generateJWT(existingUser)
        console.log('user already exists ')
        res.cookie('jwt', token, cookieOptions)
        console.log('token', token)
        return res.status(200).json({ message: 'user already exists' })
      } else {
        const newUser = await User.create({
          linkedinId: linkedinUserData.sub,
          name: linkedinUserData.name,
          email: linkedinUserData.email,
          role: role,
        })

        if (newUser) {
          let token = generateJWT(newUser)
          res.cookie('jwt', token, cookieOptions)
          return res
            .status(200)
            .send({ message: `sucessfully registed as ${role} ` })
        }
      }
    } else {
      console.error('LinkedIn API Error - Status:', response.status)
      return res
        .status(response.status)
        .json({ error: 'Error with LinkedIn API' })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error authenticating with LinkedIn' })
  }
}

function generateJWT(user) {
  const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: '30d' })
  return token
}
