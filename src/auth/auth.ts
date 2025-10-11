import mongoose from 'mongoose';
import {User} from '../Model.js';
import {type Request, type Response} from 'express';
import bcrypt from 'bcryptjs';

export const registerUser = async (req: Request, res: Response) => {
    const {email, name, password } = req.body;

    const newUser = new User({
        _id: new mongoose.Types.ObjectId().toString(),
        email,
        name,
        password: bcrypt.hashSync(password, 8),
        isAuthenticated: true
    });

    try {
        await newUser.save();
        const responseJson = {
            id: newUser._id,
            name: newUser.name,
            isAuthenticated: newUser.isAuthenticated,
            message: 'User registered successfully'
        };
        res.status(201).json(responseJson);
    } catch (error) {
        res.status(500).json({ error: 'Failed to register user' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        
        const responseJson = {
            id: user._id,
            name: user.name,
            isAuthenticated: true,
            message: 'User logged in successfully'
        };
        res.status(200).json(responseJson);
    } catch (error) {
        res.status(500).json({ error: 'Failed to log in user' });
    }
};
export const logout = async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    user.isAuthenticated = false;
    await user.save();
    res.status(200).json({ isAuthenticated: false, message: 'User logged out successfully' });
}