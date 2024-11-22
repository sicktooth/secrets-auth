require('dotenv').config();
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const {Schema} = mongoose;

const connectDB = ()=> mongoose.connect('mongodb://localhost:27017/userDB');
const userSchema = new Schema({
    email: {type: String, required: true},
    password: {type: String, required: true}
  })
const secret = process.env.encryptionPassword;
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password']});
const User = mongoose.model('User', userSchema)


module.exports = {
    User,
    connectDB
}