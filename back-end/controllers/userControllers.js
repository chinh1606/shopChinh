const User = require("../models/users");

exports.getUsers = async (req, res) => {
    try {
        const usersData = await User.find();
        res.status(200).json(usersData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
} 

exports.getUserById = async ( req, res ) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if(!user) {
            res.status(404).json({ error: " Không tồn tại người dùng " });
        }
            res.status(200).json(user);
    
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.createUser = async (req, res) => {
    try {
        const { username, email, phone, password, address } = req.body; 
        const newUser = new User({
            username,
            email,
            phone,
            password,
            address,
        });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.editUser = async (req, res) => {
    try {
        const { username, email, phone, password, address } = req.body;
        const { id } = req.params;

        const user = await User.findById(id);
        if(!user){
            res.status(404).json({ error: " Không tồn tại người dùng này "});
        }

        user.username = username;
        user.email = email;
        user.phone = phone;
        user.password = password;
        user.address = address;
        
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "Người dùng đã xóa thành công"})
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

