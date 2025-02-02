import jwt from 'jsonwebtoken';

function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token from Authorization header

    if (!token) {
        return res.status(401).json({ Error: true, msg: "Access Denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Verify token with your secret key
        req.user = decoded; // Attach decoded user data to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error(error);
        return res.status(400).json({ Error: true, msg: "Invalid token." }); // Token verification failed
    }
}

export default authenticateToken;
