const Order = require("../models/order");
const User = require("../models/users")

exports.getOrders = async (req, res) => {
    try {
        const ordersData = await Order.find().populate('products.product_id').populate('user_id');
        res.status(200).json(ordersData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
} 

exports.getOrderById = async ( req, res ) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);

        if(!order) {
            res.status(404).json({ error: " Không tồn tại đơn hàng này " }) 
        }
            res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.createOrder = async (req, res) => {
    try {
        const { products , user_id, order_date, total_amount, status, shipping_address, payment } = req.body; 
        const checkUser = await User.findById(user_id);

        if(!checkUser) {
            res.status(404).json({ error: " Không tìm thấy khách hàng " })
        }

        const newOrder = new Order({
            products: products.map(product =>({
                product_id: product.product_id,
                quantity: product.quantity,
                price: product.price,
                name: product.name,
            })),
            order_date,
            total_amount,
            status,
            shipping_address, 
            payment,
            user_id,
        });
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.editOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new : true });

        if(!order) {
            res.status(404).json({ error: " Đơn hàng không tồn tại "});
        } 
        res.status(200).json(order);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        
        await Order.findByIdAndDelete(id);
        res.status(200).json({ message: "Đơn hàng này được xóa thành công"})
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

