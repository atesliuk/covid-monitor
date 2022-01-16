const jwt = require('jsonwebtoken');

const throwNotAuthenticated = () => {
    const error = new Error('NOT_AUTHENTICATED');
    error.statusCode = 401;
    throw error;
};

module.exports = (req, res, next) => {
    const token = req.get('Authorization')?.split(' ')[1];
    if (token === 'null' || token === undefined) {
        throwNotAuthenticated();
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        throwNotAuthenticated();
    }
    req.userId = decodedToken.userId;
    next();
};
