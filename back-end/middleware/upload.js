const multer = require("multer");
const path = require("path");

const fileCheck = ( req, file, cb ) => {         // fileFilter
    const allowedTypes = ["image/png", "image/jpg", "image/gif", "image/webp", "image/jpeg"];

    if(allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(" Chỉ hỗ trợ các file có định dạng png, jpg, gif, webp ", false ));
    }
}

const storage = multer.diskStorage({ 
    destination: function( req, file, cb ) {
        cb( null, "public/images" );
    }, 
    filename: function ( req, file, cb ) {
        const randomName = Date.now() + "-" + Math.round( Math.random() * 1E9 ); 
        cb( null, randomName + path.extname(file.originalname))

    }
 })

const upload = multer({
    storage: storage,
    fileFilter: fileCheck,
    limits: {
        fileSize: 5 * 1024 * 1024,
    }
})

module.exports = upload;