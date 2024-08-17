require('dotenv').config(); // Cargar las variables de entorno al inicio del script

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Asegúrate de que el camino es correcto

mongoose.connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => console.error(err));

const createUsers = async () => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword1 = await bcrypt.hash('password1', salt);

        const users = [

            {
                firstName: 'Federico',
                lastName: 'Dotto',
                email: 'user@example.com',
                password: hashedPassword1,
                role: 'user'
            },
            {
                firstName: 'Alexa',
                lastName: 'Nieva',
                email: 'anieva@example.com',
                password: hashedPassword1,
                role: 'user'
            },
            {
                firstName: 'Alejandro',
                lastName: 'Luciani',
                email: 'admin@example.com',
                password: hashedPassword1,
                role: 'admin'
            }
        ];

        await User.insertMany(users);
        console.log('Usuario creado correctamente');
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
};

createUsers();
