const express = require('express')
const { create } = require('express-handlebars')
const handlers = require('./lib/handlers')
const weatherMiddleware = require('./lib/middleware/weather')

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

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set('view cache', true)

app.use(express.static(__dirname + '/public'))
app.use(weatherMiddleware)

const port = process.env.PORT || 3000

app.get('/', handlers.home)

app.get('/about', handlers.about)

app.get('/section-test', handlers.sectionTest)

app.use(handlers.notFound)

app.use(handlers.serverError)

app.listen(port, () =>
    console.log(
        `Express started on http://localhost:${port}; ` +
            `press Ctrl-C to terminate.`
    )
)
