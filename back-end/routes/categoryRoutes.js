const express = require("express");

const categoryControllers = require("../controllers/categoryControllers");

const router = express.Router();

router.get('/', categoryControllers.getCategories);
router.get('/:id', categoryControllers.getCategoryById);
router.post('/', categoryControllers.createCategory);
router.put('/:id', categoryControllers.editCategory);
router.delete('/:id', categoryControllers.deleteCategory);

module.exports = router;
