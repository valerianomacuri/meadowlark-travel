const express = require('express')
const { create } = require('express-handlebars')
const handlers = require('./lib/handlers')
const weatherMiddleware = require('./lib/middleware/weather')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const credentials = require('./.credentials.development')
const flashMiddleware = require('./lib/middleware/flash')
const { check } = require('express-validator')
const validateNewsletterSignup = require('./lib/middleware/validateNewsletterSignup')
require('dotenv').config()

const port = process.env.PORT || 3000

// handlebars config
const hbs = create({
    defaultLayout: 'main',
    helpers: {
        section(name, options) {
            if (!this._sections) {
                this._sections = {}
            }
            this._sections[name] = options.fn(this)
            return null
        },
    },
})

const app = express()

//* Templating with Handlebars
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

//* Form data
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//* Cookies and Sessions
app.use(cookieParser(credentials.cookieSecret))
app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: credentials.cookieSecret,
    })
)

//* Serve static files
app.use(express.static(__dirname + '/public'))

app.use(weatherMiddleware)
app.use(flashMiddleware)

app.get('/', handlers.home)

app.get('/about', handlers.about)

// handlers for browser-based form submission
app.get('/newsletter-signup', handlers.newsletterSignup)
app.post(
    '/newsletter-signup/process',
    [
        check(
            'email',
            'The email address you entered was not valid.'
        ).isEmail(),
        validateNewsletterSignup,
    ],
    handlers.newsletterSignupProcess
)
app.get('/newsletter-signup/thank-you', handlers.newsletterSignupThankYou)
app.get('/newsletter-archive', handlers.newsletterSignupThankYou)

app.use(handlers.notFound)

app.use(handlers.serverError)

app.listen(port, () =>
    console.log(
        `Express started on http://localhost:${port}; ` +
            `press Ctrl-C to terminate.`
    )
)
