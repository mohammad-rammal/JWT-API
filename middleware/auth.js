const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

exports.authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('No token provided, please login again!');
    }

    const token = authHeader.split(' ')[1];
    // console.log('token', token);
    // let decoded;
    // let token1 = token.split('.')[0];
    // let token2 = token.split('.')[1];

    try {
        let decoded = jwt.verify(token, process.env.JWT_SECRET);

        // console.log('decoded', decoded); //decoded { id: 14, username: 'Mohammad', iat: 1726320910, exp: 1728912910 }

        const {id, username} = decoded;
        req.user = {id, username};

        next();
    } catch (error) {
        throw new UnauthenticatedError('Not authorized to access!');
    }
};
