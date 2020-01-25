const express = require('express')
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const keys = require('../db/db')

const validateRegisterInput = require('../validation/register')
const validateLoginInput = require('../validation/login')

const UserAdminSchema = require('../models/user')

router.route('/')
    .get((req, res, next) => {

        UserAdminSchema.find((error, data) => {
            if (error) {
                return next(error)
            } else {
                res.json(data)
            }
        })

    })


// @route POST /api/user/register
// @route Register
router.route('/register')
    .post((req, res) => {

        // Form validation
        const { errors , isValid } = validateRegisterInput(req.body)

        // Check validation
        if(!isValid) {
            return res.status(400).json(errors)
        }


        const email = req.body.email

        UserAdminSchema.findOne({email}).then(user => {

            if(user) {
                return res.status(400).json({ email: 'Email already exists' })
            } else {

                const newUser = new UserAdminSchema({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })

                // Hash password before saving in database
                bcrypt.genSalt(10, (err, salt) => {

                    bcrypt.hash(newUser.password, salt, (err, hash) => {

                        if(err) throw err

                        newUser.password = hash

                        newUser
                            .save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))

                    })

                })

            }

        })
        
    })

router.route('/login')
    .post((req, res) => {

        // Form Validation
        const { errors , isValid } = validateLoginInput(req.body)

        // Check validation
        if(!isValid) {
            return res.status(400).json(errors)
        }

        // Check user by email
        const email = req.body.email
        const password = req.body.password

        UserAdminSchema.findOne({email}).then(user => {

            // Check user if exist
            if(!user) {
                return res.status(404).json({ emailNotFound: 'Email not found' })
            }

            // Check user role
            if(user.role === 'pending') {
                errors.user = 'You cannot login yet'
                return res.status(404).json(errors)
            }

            // Check password
            bcrypt.compare(password, user.password).then(isMatch => {

                if(isMatch) {

                    const payload = {
                        id: user.id,
                        name: user.name,
                        admin: user.admin
                    }

                    jwt.sign(
                        payload,
                        keys.secretOrKey,
                        { expiresIn: 3600 },
                        (err, token) => {
                            res.json({
                                success: true,
                                token: 'Bear ' + token
                            })
                        }
                    )

                } else {
                    return res.status(400).json({ passwordIncorrect: 'Password was wrong' })
                }

            })

        })

    })

module.exports = router