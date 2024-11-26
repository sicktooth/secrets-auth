const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const {Schema} = mongoose;
const passportLocalMongoose = require('passport-local-mongoose')

const connectDB = ()=> mongoose.connect('mongodb://localhost:27017/userDB');
const userSchema = new Schema({
    googleId: String,
    email: String,
    password: String
  })
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate)
// console.log(userSchema.plugin(findOrCreate));

const User = mongoose.model('User', userSchema)


module.exports = {User, connectDB, findOrCreate}