const sendResponse = require('../utils/response');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    console.debug(`[Error] ${err.message}`);

    let statusCode = error.statusCode || 500;

    if (err.name === 'CastError') {
        error.message = `Resource not found`;
        statusCode = 404;
    }

    if (err.code === 11000) {
        error.message = 'Duplicate field value entered';
        statusCode = 400;
    }

    if (err.name === 'ValidationError') {
        error.message = Object.values(err.errors).map(val => val.message).join(', ');
        statusCode = 400;
    }

    sendResponse(res, statusCode, false, error.message || 'Server Error');
};

module.exports = errorHandler;
