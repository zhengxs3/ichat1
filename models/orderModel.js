const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    userId:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productsIds:[{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }]
},{timestamps: true})

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;