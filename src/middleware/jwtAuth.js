require("dotenv").config();
const JWT = require('jsonwebtoken');
const AppError = require('../utils/error.utils.js');
const secret = process.env.JWT_SECRET;


const jwtAuth = (req, res, next) => {
    console.log("TOKEN : ",req.cookies?.token);
    const token = req.cookies?.token || null;
    if (!token) {
        return next(new AppError("Not Authorized: No token provided",401));
    }

    try {
        // Verify JWT token
        const payload = JWT.verify(token,secret);

        console.log(payload)
        // Attach user info to the request object
        req.user = { id: payload.id, email: payload.email };
        next();
    } catch (error) {
        return next(new AppError(`Not Authorized : ${error.message}`,401))
    }
};

module.exports = jwtAuth;