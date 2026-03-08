const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../utils/auth');

router.post('/order', verifyToken, orderController.createOrder);

router.get('/order/list', verifyToken, orderController.listOrders);
router.get('/order/:orderId', verifyToken, orderController.getOrder);


router.put('/order/:orderId', verifyToken, orderController.updateOrder);
router.delete('/order/:orderId', verifyToken, orderController.deleteOrder);

module.exports = router;