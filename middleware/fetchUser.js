const jwt = require('jsonwebtoken');
require('dotenv').config();

const fetchUser = (req, res, next) => {
    // Get the user from the JWT Token and add id to obj
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ error: "Please Authenticate using valid token" });
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data.user; // Change req.body.user to req.user
        next();
    } catch (error) {
        res.status(401).send({ error: "Please Authenticate using valid token" });
    }
}

module.exports = fetchUser;
