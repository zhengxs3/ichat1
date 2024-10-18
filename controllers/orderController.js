const Order = require('../models/orderModel');

exports.getAllOrders = async (req, res) => {
    try{
        const orders = await Order.find();
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({message: 'Server error', error})
    }
};

exports.getOrderById = async (req, res) => {
    const orderId = req.params.id;
    try{
        const order = await Order.findById(orderId);

        if(!order){
            return res.status(404).json({message: 'Order not found'})
        }
        res.status(200).json(order);

    } catch (error) {
        res.status(500).json({message: 'Server error', error})
    }
};



exports.createOrder = async (req, res) => {
    const { userId, productsIds } = req.body;

    try {
        const newOrder = new Order({
            userId, 
            productsIds,
        });

        const savedOrder = await newOrder.save();
        res.status(201).json({
            message: 'Order created successfully',
            order: savedOrder,  // 修改这里
        });

    } catch (error) {
        res.status(500).json({message: 'Server error', error});
    }
};



exports.updateOrder = async (req, res) => {
    const orderId = req.params.id;
    const { userId, productsIds } = req.body;

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({message: 'Order not found'});
        }

        if (userId) order.userId = userId;
        if (productsIds) order.productsIds = productsIds;

        const updatedOrder = await order.save();
        res.status(200).json({
            message: 'Order updated successfully',
            order: updatedOrder  // 修改这里
        });

    } catch (error) {
        res.status(500).json({message: 'Server error', error});
    }
};



exports.deleteOrder = async (req, res) => {
    const orderId = req.params.id;

    try {
        const deleteOrder = await Order.findByIdAndDelete(orderId);

        if (!deleteOrder) {
            return res.status(404).json({message: 'Order not found'});
        }
        res.status(200).json({
            message: 'Order deleted successfully',
            order: deleteOrder,  // 修改这里
        });

    } catch (error) {
        res.status(500).json({message: 'Server error', error});
    }
};
