const express = require('express');
const router = express.Router();
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes')

router.get('/', (req,res) => {
    res.send('Welcome to the API')
})

router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);


module.exports = router;