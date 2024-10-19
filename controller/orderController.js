const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// Place an order (Customer)

exports.placeOrder = async (req, res) => {
  const { orderItems } = req.body;

  // Check if orderItems is provided and is an array
  if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
    return res.status(400).json({ message: 'No items in the order' });
  }

  try {
    // Calculate total price
    let totalPrice = 0;
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      totalPrice += product.price * item.quantity;
    }

    // Create the order
    const order = new Order({
      user: req.user._id,  // From the authenticated user
      orderItems,
      totalPrice,
    });

    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// View all orders for the authenticated customer
exports.getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('orderItems.product', 'name price');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// View all customer orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').populate('orderItems.product', 'name price');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update order status (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = req.body.status || order.status;
    await order.save();
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
