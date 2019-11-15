const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  },
  entries: {
    type: Number,
    default: 0
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
