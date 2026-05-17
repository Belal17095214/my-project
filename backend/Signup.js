const mongoose = require('mongoose')
const signupSchema = new mongoose.Schema({
        name: String,
        email: String,
        password: String,
        token: { type: String, default: "" },
        isLoggedIn: { type: Boolean, default: false },
        lastLogin: { type: Date, default: Date.now }
});
module.exports = mongoose.model('signup', signupSchema)