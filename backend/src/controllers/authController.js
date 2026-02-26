const authService = require('../services/authService');
const sendResponse = require('../utils/response');

const setTokenCookies = (res, accessToken, refreshToken) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true, // Must be true for cross-site cookies
        sameSite: 'none', // Must be 'none' to allow Render to send cookies to Netlify
        maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const { user, accessToken, refreshToken } = await authService.register(name, email, password);

        setTokenCookies(res, accessToken, refreshToken);

        return sendResponse(res, 201, true, 'User registered successfully', {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        if (error.message === 'User already exists') {
            return sendResponse(res, 400, false, error.message);
        }
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, accessToken, refreshToken } = await authService.login(email, password);

        setTokenCookies(res, accessToken, refreshToken);

        return sendResponse(res, 200, true, 'Login successful', {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        if (error.message === 'Invalid credentials') {
            return sendResponse(res, 401, false, error.message);
        }
        next(error);
    }
};

exports.logout = (req, res) => {
    res.cookie('accessToken', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.cookie('refreshToken', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    return sendResponse(res, 200, true, 'User logged out successfully');
};

exports.refresh = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        const { user, accessToken, refreshToken } = await authService.refresh(token);

        setTokenCookies(res, accessToken, refreshToken);

        return sendResponse(res, 200, true, 'Token refreshed successfully');
    } catch (error) {
        return sendResponse(res, 401, false, 'Invalid refresh token');
    }
};

