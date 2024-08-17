const bcrypt = require('bcryptjs');
const { SignJWT } = require('jose');
const User = require('../models/User');

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send('User not found');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid credentials');

        const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

        const token = await new SignJWT({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1h')
        .sign(secretKey);

        res.json({ token });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).send('Server error');
    }
};

const register = async (req, res) => {
    const { email, password, role, firstName, lastName } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword, role, firstName, lastName });
        await user.save();
        res.status(201).send('User registered');
    } catch (error) {
        console.error("Registration error:", error.message);
        res.status(500).send('Server error');
    }
};

module.exports = { login, register };






