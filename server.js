const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const connectDB = require('./Database/ConnectDB')
const userRouter = require('./Routes/UserRoute')
const adminRouter = require('./Routes/AdminRouter')
const linkedInRouter = require('./Routes/LinkedinRouter')
const cors = require('cors')

// Enable CORS for all routes
app.use(
  cors({
    origins: '*',
  }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/User', userRouter)
app.use('/Admin', adminRouter)
app.use('/auth/linkedin', linkedInRouter)

app.listen(process.env.PORT, async () => {
  console.log(`Server listening on http://localhost:${process.env.PORT}`)
  await connectDB(process.env.MONGODB_URI)
})
