const userRepository = require('../repositories/userRepository');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokens');

class AuthService {
    async register(name, email, password) {
        const userExists = await userRepository.findByEmail(email);
        if (userExists) {
            throw new Error('User already exists');
        }

        const user = await userRepository.create({
            name,
            email,
            password,
            role: 'user'
        });

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        return { user, accessToken, refreshToken };
    }

    async login(email, password) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        return { user, accessToken, refreshToken };
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw new Error('No refresh token');
        }

        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);

        const user = await userRepository.findById(decoded.id);
        if (!user) {
            throw new Error('Invalid token user');
        }

        const newAccessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        return { user, accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
}

module.exports = new AuthService();
