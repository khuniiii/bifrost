const mongoose = require("mongoose");
const { Schema } = mongoose;

const date = new Date()
date.setHours(date.getHours() + 9)

const account = new Schema({
  id: Number,
  pw: String,
  email: String,
  grade: Number,
  classroom: Number,
  number: Number,
  name: String,
  createdAt: {
    type: Date,
    default: date,
  },
});

module.exports = mongoose.model("account", account);
