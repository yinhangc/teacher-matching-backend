const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const router = express.Router();

const { signup, login, updatePassword, protect } = authController;

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/updatePassword').patch(protect, updatePassword);

module.exports = router;
