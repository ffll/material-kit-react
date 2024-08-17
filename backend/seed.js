const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('MongoDB connected');

        // Usuarios iniciales
        const users = [
            {
                firstName: 'Alejandro',
                lastName: 'Luciani',
                email: 'admin@example.com',
                password: 'password123',
                role: 'admin'
            },
            {
                firstName: 'Federico',
                lastName: 'Dotto',
                email: 'user@example.com',
                password: 'password123',
                role: 'user'
            }
        ];

        for (let userData of users) {
            let user = await User.findOne({ email: userData.email });
            if (!user) {
                user = new User(userData);
                await user.save();
            }
        }

        console.log('Usuarios iniciales creados/verificados');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
