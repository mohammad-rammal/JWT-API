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

const axios = require('axios');

exports.dashboard = async (req, res) => {
    console.log(req.user);

    const randomNumber = Math.floor(Math.random() * 100000);
    const token = req.headers.authorization.split(' ')[1];
    const token1 = token.split('.')[0];
    const token2 = token.split('.')[1];

    // Get user's IP address
    const userIP =
        req.headers['x-forwarded-for']?.split(',').shift() ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        req.connection?.socket?.remoteAddress;

    try {
        // Make a request to ipinfo.io to get location data from IP
        const geoLocationResponse = await axios.get(`https://ipinfo.io/${userIP}?token=872395586b748b`);
        const {city, region, country} = geoLocationResponse.data; // Extract location data
        console.log(geoLocationResponse.data);
        // Send response with location data

        res.status(200).json({
            msg: `Welcome ${req.user.username},`,
            secret: `You are successfully logged in \n and your token is <p style="color: red;">${token1}\n${token2}</p>. Generated number is ${randomNumber}. \n You are accessing this from ${city}, ${region}, ${country}`,
        });
    } catch (error) {
        console.error('Error fetching location:', error);
        res.status(500).json({
            msg: `Welcome ${req.user.username},`,
            secret: `You are successfully logged in \n and your token is <p style="color: red;">${token1}\n${token2}</p>. Generated number is ${randomNumber}`,
            location: 'Could not retrieve your location.',
        });
    }
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
