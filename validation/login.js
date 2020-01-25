const Validator = require('validator')
const isEmpty = require('is-empty')


module.exports = function validateLoginInput(data) {

    const errors = {}

    // Empty Fields
    data.email = !isEmpty(data.email) ? data.email : ''
    data.password = !isEmpty(data.password) ? data.password : ''

    // Email Check *** isEmail .. not isEmpty in (!Validator.isEmail(data.email)) ***
    if(Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required'
    } else if(!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid'
    }

    // Password Check
    if(Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required'
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }

}