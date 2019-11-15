const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserCredentialSchema = new Schema({
  email: {
    type: String,
    required: true
  }
});

const UserCredential = mongoose.model("UserCredential", UserCredentialSchema);

module.exports = UserCredential;
