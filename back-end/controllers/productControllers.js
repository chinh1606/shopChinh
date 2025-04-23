const Product = require("../models/product");

exports.getProducts = async (req, res) => {
    try {
        const productsData = await Product.find().populate('category_id');
        res.status(200).json(productsData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
} 

exports.getProductById = async ( req, res ) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if(!product) {
            res.status(404).json({ error: "Không tồn tại sản phẩm này" })
        }
            res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.createProduct = async (req, res) => {
    try {
        const { name, category_id, description, price, quantity_in_stock, image, is_active } = req.body; 
        // const checkCategogy = await Category.findById(category_id);

        // if(!checkCategogy) {
        //     res.status(404).json({ error: "Không tìm thấy thể loại sản phẩm" })
        // }

        const newProduct = new Product({
            name,
            description,
            category_id,
            price,
            quantity_in_stock, 
            img_url: image,
            is_active,
        });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.editProduct = async (req, res) => {
    try {
        const { name, description, category_id, price, quantity_in_stock, image, is_active } = req.body;
        const { id } = req.params;

        const product = await Product.findById(id);
        if(!product){
            res.status(404).json({ error: " Sản phẩm không tồn tại "});
        }

        if(category_id) {
            const checkCategogy = await Category.findById(category_id);

            if(!checkCategogy) {
                res.status(404).json ({ error: " Không tìm thấy thể loại này " });
            }

        }
        product.name = name;
        product.description = description;
        product.category_id = category_id;
        product.price = price;
        product.quantity_in_stock = quantity_in_stock;
        product.is_active = is_active;
        product.img_url =  image;
        
        await product.save();
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: "Thể loại đã xóa thành công"})
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

