const orderModel = require('../models/orderModel');

exports.createOrder = (orderData, callback) => {
  orderModel.createOrder(orderData, callback);
};

exports.getOrder = (orderId, callback) => {
  orderModel.getOrderById(orderId, callback);
};

exports.listOrders = (callback) => {
  orderModel.listOrders(callback);
};

exports.updateOrder = (orderId, updateData, callback) => {
  orderModel.updateOrder(orderId, { ...updateData, numeroPedido: orderId }, callback);
};

exports.deleteOrder = (orderId, callback) => {
  orderModel.deleteOrder(orderId, callback);
};