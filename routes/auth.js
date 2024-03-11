const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');
require('dotenv').config();

const router = express.Router();

// Validation middleware for signup
const validateSignUpUserInput = [
    body('email').isEmail().withMessage("Invalid email address"),
    body('password').trim().isLength({ min: 5 }).withMessage("Password cannot be blank"),
    body('name').trim().isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),
];

// Create new User: POST-'/api/auth/signup' To create new User
router.post('/signup', validateSignUpUserInput, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: "User with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({ name, email, password: hashedPassword });

        const authToken = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET);
        res.status(201).json({ authToken });
    } catch (error) {
        // console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Validation middleware for signup
const validateLoginUserInput = [
    body('email').isEmail().withMessage("Invalid email address"),
    body('password').trim().notEmpty().withMessage("Password cannot be blank"),
];

// Login User: POST-'/api/auth/login'
router.post('/login', validateLoginUserInput, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ errors: "Invalid credentials" });
        }

        const authToken = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET);
        res.status(200).json({ authToken });
    } catch (error) {
        // console.error(error.message);
        res.status(500).json({ errors: 'Internal Server Error' });
    }
});
// Login User: POST-'/api/auth/getuser'
router.post('/getuser',
    fetchUser,
    async (req, res) => {
        try {
            const userId = req.user.id;

            let user = await User.findOne({ _id: userId }).select("-password");
            if (!user) {
                return res.status(400).json({ errors: "Invalid credentials" });
            }
            res.json(user);
        } catch (error) {
            // console.error(error.message);
            res.status(500).json({ errors: 'Internal Server Error' });
        }
    });



module.exports = router;
