const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  userName: {
    type: String
  },
  password: {
    type: String
  },
  authorizationLevel: {
    type: String,
    default: "user",
    enum: ['user', 'admin', 'superAdmin']
  }, 
  deposit: {
    type: Number
  },
  role: {
    type: String,
    default: "buyer",
    enum: ['seller', 'buyer']
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;