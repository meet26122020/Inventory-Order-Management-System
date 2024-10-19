const express = require('express');
const { placeOrder, getCustomerOrders, getAllOrders, updateOrderStatus } = require('../controller/orderController');
const { authenticate, IsAdmin } = require('../middleware/authenticate ');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management operations
 */

/**
 * @swagger
 * /orders/add:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []  # If you're using JWT authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                       description: The product ID
 *                     quantity:
 *                       type: integer
 *                       description: The quantity of the product
 *             required:
 *               - orderItems
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: No items in the order
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.post('/add', authenticate, placeOrder);

/**
 * @swagger
 * /orders/my-orders:
 *   get:
 *     summary: Get all orders for the authenticated customer
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []  # If you're using JWT authentication
 *     responses:
 *       200:
 *         description: A list of orders for the customer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/my-orders', authenticate, getCustomerOrders);

/**
 * @swagger
 * /orders/admin:
 *   get:
 *     summary: Get all orders for admin
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []  # If you're using JWT authentication
 *     responses:
 *       200:
 *         description: A list of all customer orders
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get('/admin', authenticate, IsAdmin, getAllOrders);

/**
 * @swagger
 * /orders/admin/{id}:
 *   put:
 *     summary: Update the status of an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []  # If you're using JWT authentication
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the order to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Shipped, Delivered]
 *                 description: The new status of the order
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.put('/admin/:id', authenticate, IsAdmin, updateOrderStatus);

module.exports = router;
