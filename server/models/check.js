const mongoose = require("mongoose");
const { Schema } = mongoose;

const date = new Date()
date.setHours(date.getHours() + 9)

const check = new Schema({
  id: Number,
  first: Boolean,
  second: Boolean,
  third: Boolean,
  createdAt: {
    type: Date,
    default: date,
  },
});

module.exports = mongoose.model("check", check);
