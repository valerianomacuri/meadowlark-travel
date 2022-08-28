const express = require('express')
const { create } = require('express-handlebars')
const fortune = require('./lib/fortune')

const hbs = create({ defaultLayout: 'main' })

const app = express()

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'))

const port = process.env.PORT || 3000

app.get('/', (req, res) => res.render('home'))

app.get('/about', (req, res) => {
    res.render('about', { fortune: fortune.getFortune() })
})

app.use((req, res) => {
    res.status(404)
    res.render('404')
})

app.use((err, req, res) => {
    console.error(err.message)
    res.status(500).render('500')
})

app.listen(port, () =>
    console.log(
        `Express started on http://localhost:${port}; ` +
            `press Ctrl-C to terminate.`
    )
)
