const express = require('express');
const {dashboard, login, signup} = require('../controllers/main');
const router = express.Router();

// /api/v1/dashboard
router.route('/dashboard').get(dashboard);

// /api/v1/login
router.route('/login').post(login);

// /api/v1/signup
router.route('/signup').post(signup);

module.exports = router;
