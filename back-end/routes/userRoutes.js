const express = require("express");

const userControllers = require("../controllers/userControllers");

const router = express.Router();

router.get('/', userControllers.getUsers);
router.get('/:id', userControllers.getUserById);
router.post('/', userControllers.createUser);
router.put('/:id', userControllers.editUser);
router.delete('/:id', userControllers.deleteUser);

module.exports = router;