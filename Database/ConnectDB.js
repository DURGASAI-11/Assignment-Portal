const mongoose = require('mongoose')

//connecting database mongoose.connect(your mongodb uri)
const connectDB = (Mongo_URI) => {
  return mongoose
    .connect(Mongo_URI, {
      dbName: process.env.DATABASE_NAME,
    })
    .then(() => {
      console.log('DB Connected')
    })
    .catch((err) => {
      console.log(err.message)
    })
}
module.exports = connectDB
