const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 255,
  },
  email: {
    type: String,
    required: true,
    maxlength: 100,
  },
  password: {
    type: String,
    required: true,
    maxlength: 255,
    minLength: 6,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("User", UserSchema);
