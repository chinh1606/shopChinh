const News = require("../models/news");
const User = require("../models/users");

exports.getNews = async ( req, res ) => {
    try {
        const newsData = await News.find().populate('user_id');
        res.status(200).json(newsData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getNewsById = async ( req, res ) =>{
    try {
        const { id } = req.params;
        const news = await News.findById(id);

        if(!news) {
            res.status(400).json({ error: " Không tồn tại tin tức này " })
        } 
            res.status(200).json(news);
            
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.createNews = async ( req, res ) => {
    try {
        const { title , content, user_id } = req.body;
        const checkUser = await User.findById(user_id);
        
        if(!checkUser) {
            res.status(404).json({ error: "Không tìm thấy người dùng  " });
        }
        const newNews = new News({
            title,
            content,
            user_id,
        });
        await newNews.save();
        res.status(201).json(newNews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.editNews = async ( req, res ) => {
    try {
        const { title, content, user_id } = req.body;
        const { id } = req.params;
        
        const news = await News.findById(id);
        if(!news) {
            res.status(400).json({ error: "Tin tức này không tồn tại" });
        }

        if(user_id) {
            const checkUser = await User.findById(user_id);
        
            if(!checkUser) {
                res.status(404).json({ error: "Không tìm thấy người dùng  " });
            }
        }

        news.title = title;
        news.content = content;
        news.user_id = user_id;

        await news.save();
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteNews = async ( req, res ) => {
    try {
        const { id } = req.params;

        await News.findByIdAndDelete(id);
        res.status(200).json({ message: "Tin tức đã xóa thành công" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}