const { jwtVerify } = require('jose');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).send('Access denied. No token provided.');

    // Verifica si el token tiene el prefijo 'Bearer '
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7, authHeader.length) : authHeader;
    
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secretKey);
        req.user = payload; // Almacena el payload del token en req.user
        next(); // Continua al siguiente middleware o ruta
    } catch (error) {
        console.error('Error during token verification:', error);
        res.status(400).send('Invalid token.');
    }
};

module.exports = authMiddleware;


