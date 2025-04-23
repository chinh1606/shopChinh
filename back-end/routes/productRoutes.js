const express = require("express");
const productControllers = require("../controllers/productControllers");
const upload = require("../middleware/upload");

const router = express.Router();

router.get('/', productControllers.getProducts);
router.get('/:id', productControllers.getProductById);
router.post('/', upload.single("image"), productControllers.createProduct);
router.put('/:id', upload.single("image"), productControllers.editProduct);
router.delete('/:id', productControllers.deleteProduct);

module.exports = router;