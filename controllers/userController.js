const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

exports.getAllUsers = async (req, res) => {
    try{
        const users = await User.find().select('-password');
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({message: 'Server error', error})
    }

}

exports.getUserById = async (req, res) => {
    const userId = req.params.id;
    try{
        const user = await User.findById(userId).select('-password');

        // 检查用户是否存在
        if(!user){
            return res.status(404).json({message: 'User not found'})
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: 'Server error', error})
    }
}

exports.createUser = async (req, res) => {
    const {username, email, password, role} = req.body;
    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: 'User already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password:hashedPassword,
            role,
        }) 

        const savedUser = await newUser.save();
        res.status(201).json({
            message: 'User created !',
            user: savedUser,
        })

    } catch (error) {
        res.status(500).json({message: 'Server error', error})
    }
}

exports.deleteUser = async (req, res) => {
    const userId = req.params.id;

    try{
        const deleteUser = await User.findByIdAndDelete(userId);

        if(!deleteUser){
            return res.status(404).json({message: 'User not found'})
        }
        res.status(200).json({
            message: 'User deleted successfully',
            user: deleteUser,
        });
    } catch (error) {
        // En cas d'erreur serveur, renvoie une réponse d'erreur
        res.status(500).json({message: 'Server error', error})
    }
}

exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const { username, email, password, role } = req.body;

    try{
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({message: 'User not found'});
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password,10);
        if (role) user.role = role;

        const updatedUser = await user.save();
        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser
        });
        
    } catch (error) {
        res.status(500).json({message: 'Server error', error})
    }

   
}


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try{
        // 查找用户是否存在
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message: 'User not found'});
        }

        const match = await bcrypt.compare(password, user.password);
        if(!match) {
            return res.status(400).json({message: 'Invalid creadentials'});
        }

        const token = jwt.sign(
            {userId: user._id, role: user.role},
            JWT_SECRET,
            {expiresIn: '1h'}
        );

        res.status(200).json({
            token,
            user: user,
        })


    } catch (error) {
        res.status(500).json({message: 'Server error', error})
    }
}
