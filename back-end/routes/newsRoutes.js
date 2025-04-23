const express = require("express");

const newsControllers = require("../controllers/newControllers");

const router = express.Router();

router.get('/', newsControllers.getNews);
router.get('/:id', newsControllers.getNewsById);
router.post('/', newsControllers.createNews);
router.put('/:id', newsControllers.editNews);
router.delete('/:id', newsControllers.deleteNews);

module.exports = router;