const sendResponse = (res, statusCode, success, message, data = null, error = null) => {
    const response = {
        success,
        message
    };
    if (data) response.data = data;
    if (error) response.error = error;

    return res.status(statusCode).json(response);
};

module.exports = sendResponse;
