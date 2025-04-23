const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        require: true,
    },
    description: { type: String, required: true, default: "" },
    price: { type: Number, required: true },
    quantity_in_stock: { type: Number, required: true, default: 0 },
    img_url: { type: String, required: true },
    is_active: { type: Boolean, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);