const bcrypt = require('bcryptjs');
const { User } = require('../models/User');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res, next) => {
    const userData = req.body;
    if (!(userData?.username && userData.fullName && userData.password)) {
        const err = new Error('USER_REGISTER_DATA_INVALID');
        err.statusCode = 422;
        err.data = userData;
        throw err;
    }

    try {
        const existingUser = await User.findOne({ username: userData.username });

        if (existingUser) {
            const err = new Error('USER_ALREADY_EXIST');
            err.statusCode = 422;
            err.data = userData;
            throw err;
        }

        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const user = new User({
            username: userData.username,
            fullName: userData.fullName,
            password: hashedPassword,
        });
        const savedUser = await user.save();
        const token = jwt.sign({ userId: savedUser._id.toString() }, process.env.TOKEN_SECRET);
        res.status(201).json({ token: token });
    } catch (err) {
        console.error('Error when registering a user:', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

const throwLoginFailedError = (message, data) => {
    const err = new Error(message);
    err.statusCode = 422;
    err.data = data;
    throw err;
};

exports.login = async (req, res, next) => {
    const loginData = req.body;
    if (!(loginData?.username && loginData.password)) {
        throwLoginFailedError('INVALID_LOGIN_DATA', loginData);
    }

    try {
        const existingUser = await User.findOne({ username: loginData.username });
        if (!existingUser) {
            throwLoginFailedError('FAILED_TO_LOGIN', loginData);
        }

        const passwordsMatch = await bcrypt.compare(loginData.password, existingUser.password);
        if (!passwordsMatch) {
            throwLoginFailedError('FAILED_TO_LOGIN', loginData);
        }

        const token = jwt.sign({ userId: existingUser._id.toString() }, process.env.TOKEN_SECRET);
        res.status(201).json({ token: token });
    } catch (err) {
        console.error('Error when logging in:', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getProfile = async (req, res, next) => {
    const data = req.body;

    try {
        const existingUser = await User.findById(req.userId);
        if (!existingUser) {
            throwLoginFailedError('USER_DOESNT_EXIST', data);
        }
        const { password, ...userData } = existingUser._doc;
        res.status(200).json(userData);
    } catch (err) {
        console.error('Error when getting profile data:', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.updateProfile = async (req, res, next) => {
    const user = req.body;

    try {
        const existingUser = await User.findById(req.userId);
        if (!existingUser) {
            throwLoginFailedError('USER_DOESNT_EXIST', user);
        }

        const userWithSameUsername = await User.findOne({ username: user.username });
        if (userWithSameUsername && !userWithSameUsername._id.equals(req.userId)) {
            throwLoginFailedError('USERNAME_ALREADY_TAKEN', user);
        }

        existingUser.username = user.username;
        existingUser.fullName = user.fullName;

        const updatedUser = await existingUser.save();
        const { password, ...userData } = updatedUser._doc;
        res.status(200).json(userData);
    } catch (err) {
        console.error('Error when updating profile data:', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.changePassword = async (req, res, next) => {
    const user = req.body;

    try {
        const existingUser = await User.findById(req.userId);
        if (!existingUser) {
            throwLoginFailedError('USER_DOESNT_EXIST', user);
        }

        const passwordsMatch = await bcrypt.compare(user.oldPassword, existingUser.password);
        if (!passwordsMatch) {
            throwLoginFailedError('INVALID_OLD_PASSWORD', user);
        }

        if (user.newPassword !== user.repeatedNewPassword) {
            throwLoginFailedError('NEW_PASSWORDS_DONT_MATCH', user);
        }

        const hashedPassword = await bcrypt.hash(user.newPassword, 12);
        existingUser.password = hashedPassword;
        const updatedUser = await existingUser.save();

        const { password, ...userData } = updatedUser._doc;
        res.status(200).json(userData);
    } catch (err) {
        console.error('Error when updating profile data:', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
