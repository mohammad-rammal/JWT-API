const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/main');
const CustomAPIError = require('../errors/custom-error');

exports.login = async (req, res) => {
    try {
        const {username, password} = req.body;

        if (!username || !password) {
            throw new CustomAPIError('You must enter login data', 400);
        }
        const newUser = await User.create({username, password});
        const id = new Date().getDate();
        // console.log('id', id);
        const token = jwt.sign({id, username}, process.env.JWT_SECRET, {expiresIn: '30d'});

        res.status(200).json({
            success: true,
            msg: 'User Created',
            token,
        });
    } catch (error) {
        res.status(404).json({msg: error.message});
    }
};

exports.dashboard = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new CustomAPIError('No token provided, please login again!', 401);
    }

    const token = authHeader.split(' ')[1];
    // console.log('token', token);
    let decoded;
    let token1 = token.split('.')[0];
    let token2 = token.split('.')[1];
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);

        // console.log('decoded', decoded); //decoded { id: 14, username: 'Mohammad', iat: 1726320910, exp: 1728912910 }
    } catch (error) {
        throw new CustomAPIError('Not authorized to access!', 401);
    }

    const randomNumber = Math.floor(Math.random() * 100000); // 0-99

    res.status(200).json({
        msg: `Welcome ${decoded.username},`,
        secret: `You are successfully login \n and your token is <p style="color: red;"> ${token1} \n ${token2} </p>Generated number is ${randomNumber}`,
    });
};

// exports.login = async (req, res) => {
//     const {username, password} = req.body;

//     if (!username || !password) {
//         throw new CustomAPIError('You must enter login data', 400);
//     }

//     try {
//         const user = await User.findOne({username});
//         if (!user) {
//             throw new CustomAPIError('The username not exist', 401);
//         }

//         const isMatch = await user.matchPassword(password);
//         if (!isMatch) {
//             throw new CustomAPIError('The password not exist', 400);
//         }

//         const id = new Date().getDate();
//         console.log('id', id);
//         const token = jwt.sign({id, username}, process.env.JWT_SECRET, {expiresIn: '30d'});

//         res.status(200).json({
//             success: true,
//             msg: 'User Created',
//             token,
//         });
//     } catch (err) {
//         res.status(404).json({msg: err.message});
//     }
// };

exports.signup = async (req, res, next) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return next(new CustomAPIError('Please provide a username and password', 400));
    }

    try {
        const existingUser = await User.findOne({username});
        if (existingUser) {
            return next(new CustomAPIError('Username already exists', 400));
        }

        const newUser = await User.create({username, password});

        // const token = generateToken(newUser._id);

        res.status(201).json({
            success: true,
            // token,
            user: {
                id: newUser._id,
                username: newUser.username,
            },
        });
    } catch (err) {
        next(err);
    }
};
