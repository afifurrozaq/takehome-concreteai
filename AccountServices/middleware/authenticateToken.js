const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Get token from "Bearer <token>"

    if (token == null) return res.sendStatus(401); // If no token, return unauthorized

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.sendStatus(403); // If token is invalid, return forbidden
        req.user = user; // Attach user information to the request object
        next(); // Proceed to the next middleware/route handler
    });
}

module.exports = authenticateToken;
