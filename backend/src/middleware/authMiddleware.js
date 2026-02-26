const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendResponse = require('../utils/response');

exports.protect = async (req, res, next) => {
    let token = req.cookies?.accessToken;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return sendResponse(res, 401, false, 'Not authorized, no token');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return sendResponse(res, 401, false, 'Token expired');
        }
        return sendResponse(res, 401, false, 'Not authorized, token failed');
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return sendResponse(res, 403, false, `User role ${req.user.role} is not authorized`);
        }
        next();
    };
};
