const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true},
    role: { type: String, enum: ["admin", "customer"], default: "customer" },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

