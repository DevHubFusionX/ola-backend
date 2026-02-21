const Order = require('../../models/Order');

exports.createOrder = async (req, res) => {
    try {
        const { customer, items, totalAmount, paymentMethod, deliveryMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        const order = new Order({
            customer,
            items,
            totalAmount,
            paymentMethod,
            deliveryMethod
        });

        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('items.product').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.product');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error: error.message });
    }
};
