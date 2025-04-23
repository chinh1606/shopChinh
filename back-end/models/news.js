const mongoose = require('mongoose');

const newSchema = new mongoose.Schema({
    title: {type: String, required: true },
    content: {type: String, required: true },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('News', newSchema);