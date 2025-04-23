const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

router.post('/', upload.single("image"), ( req, res ) => {
    try {
        if(!req.file) {
            res.status(400).json({ error: " Không có file để tải lên  "});
        } 
        
        const image = `/public/images/${req.file.filename}`;
        res.status(200).json(image);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
} )

module.exports = router;