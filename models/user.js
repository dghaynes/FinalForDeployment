const mongoose = require("mongoose");
const bcrypt = require("bcrypt");



const userSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    roles: {type: [String], enum: ["user", "admin"], default: ["user"], required: true}
});

//compare password
userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);