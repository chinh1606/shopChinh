const express = require("express");

const orderControllers = require("../controllers/orderControllers");

const router = express.Router();

router.get('/', orderControllers.getOrders);
router.get('/:id', orderControllers.getOrderById);
router.post('/', orderControllers.createOrder);
router.put('/:id', orderControllers.editOrder);
router.delete('/:id', orderControllers.deleteOrder);

module.exports = router;
