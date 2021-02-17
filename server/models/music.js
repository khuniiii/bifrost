const mongoose = require("mongoose");
const { Schema } = mongoose;

const date = new Date()
date.setHours(date.getHours() + 9)

const music = new Schema({
  id: Number,
  title: String,
  url: String,
  artist: String,
  createdAt: {
    type: Date,
    default: date,
  },
});

module.exports = mongoose.model("music", music);
