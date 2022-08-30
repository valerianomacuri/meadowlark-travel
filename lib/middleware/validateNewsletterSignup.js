const { validationResult } = require('express-validator')

const validateNewsletterSignup = (req, res, next) => {
    const errors = validationResult(req)
    console.log(errors.array())
    if (!errors.isEmpty()) {
        req.session.flash = {
            type: 'danger',
            intro: 'Validation error!',
            message: errors.array()[0].msg,
        }
        return res.redirect(303, '/newsletter-signup')
    }
    next()
}

module.exports = validateNewsletterSignup
