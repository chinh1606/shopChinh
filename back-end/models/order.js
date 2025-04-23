const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            }, 
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            name: { type: String, required: true },
        }
    ],
    order_date: { type: Date, required: true },
    total_amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "shipped", "delivered"], default: "pending" },
    shipping_address: { type: String, required: true},
    payment: { type: String, required: true},
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);