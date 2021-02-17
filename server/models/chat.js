const mongoose = require("mongoose");
const { Schema } = mongoose;

const date = new Date()
date.setHours(date.getHours() + 9)

const chat = new Schema({
  reqId: Number,
  resId: Number,
  message: String,
  createdAt: {
    type: Date,
    default: date,
  },
});

module.exports = mongoose.model("chat", chat);
