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

const projectSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
        },
    createdAt: {
        type: Date,
        default: Date.now
        },
    updatedAt: {
        type: Date,
        default: Date.now
        },
    prompts:[promptSchema] //Array OF OBJECTS
});

module.exports = mongoose.model("projects", projectSchema);