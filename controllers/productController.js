const Product = require('../models/productModel');

exports.getAllProducts = async (req, res) => {
    try{
        const products = await Product.find();
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({message: 'Server error', error})
    }
}

exports.createProduct = async (req, res) => {
    const { title, description, price } = req.body;
    try{
        const newProduct = new Product({
            title,
            description,
            price,
        })

        const savedProduct = await newProduct.save();
        res.status(201).json({
            message: 'Product created !',
            product: savedProduct,
        })
        
    } catch (error) {
        res.status(500).json({message: 'Server error', error})
    }
}

exports.getProductById = async (req, res) => {
    const productId = req.params.id;

    try{
        const product = await Product.findById(productId);

        if(!product){
            return res.status(404).json({message: 'Product not found'})
        }
        res.status(200).json(product);

    } catch (error) {
        res.status(500).json({message: 'Server error', error})
    }

}

exports.deleteProduct = async (req, res) => {
    const productId = req.params.id;

    try{
        const deleteProduct = await Product.findByIdAndDelete(productId);

        if(!deleteProduct){
            return res.status(404).json({message: 'Product not found'})
        }
        res.status(200).json({
            message: 'Product deleted successfully',
            user: deleteProduct,
        });

    } catch (error) {
        res.status(500).json({message: 'Server error', error})
    }

}

exports.updateProduct = async (req, res) => {
    const productId = req.params.id;
    const { title, description, price } = req.body;

    try{
        const product = await Product.findById(productId);

        if(!product){
            return res.status(404).json({message: 'Product not found'});
        }

        if (title) product.title = title;
        if (description) product.description = description;
        if (price) product.price = price;

        const updatedProduct = await product.save();
        res.status(200).json({
            message: 'Product updated successfully',
            user: updatedProduct
        });
        
    } catch (error) {
        res.status(500).json({message: 'Server error', error})
    }

   
}