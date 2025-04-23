const Category = require("../models/category");

exports.getCategories = async (req, res) => {
    try {
        const categoriesData = await Category.find();
        res.status(200).json(categoriesData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
} 

exports.getCategoryById = async ( req, res ) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);

        if(!category) {
            res.status(404).json({ error: "Danh mục không tồn tại" });
        }
            res.status(200).json(category);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body; 
        const newCategory = new Category({
            name,
            description,
        });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.editCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const { id } = req.params;

        const category = await Category.findById(id);
        if(!category){
            res.status(404).json({ error: "Thể loại không tồn tại "});
        }

        category.name = name;
        category.description = description;
        
        await category.save();
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        
        await Category.findByIdAndDelete(id);
        res.status(200).json({ message: "Thể loại đã xóa thành công"})
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

