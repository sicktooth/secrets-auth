// require('dotenv').config();
const mongoose = require('mongoose');
const {Schema} = mongoose;
const passportLocalMongoose = require('passport-local-mongoose')

const connectDB = ()=> mongoose.connect('mongodb://localhost:27017/userDB');
const userSchema = new Schema({
    email: String,
    password: String
  })
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema)


module.exports = {User, connectDB}