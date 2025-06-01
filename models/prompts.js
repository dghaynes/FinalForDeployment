const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  }
}, {_id : false});

module.exports = mongoose.model("prompts", promptSchema);