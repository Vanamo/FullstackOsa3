const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

morgan.token('data', function getData (req) {
    return JSON.stringify(req.body)
})

app.use(cors())
app.use(bodyParser.json())
//app.use(morgan('tiny'))
app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))


let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Martti Tienari",
        "number": "040-123456",
        "id": 2
    },
    {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 3
    },
    {
        "name": "Lea Kutvonen",
        "number": "040-123456",
        "id": 4
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const person = req.body

    if (person.name === undefined || person.number === undefined) {
        return res.status(400).json({error: 'content missing'})
    }
    if (persons.find(p => p.name === person.name)) {
        return res.status(400).json({error: 'name must be unique'})
    }

    person.id = Math.floor(Math.random() * 1000000)
    console.log(person)

    persons = persons.concat(person)

    res.json(person)
})

app.get('/info', (req, res) => {
    let text = "puhelinluettelossa " + persons.length + " henkilön tiedot \n"
    let date = new Date()
    res.send(text + '<br></br>' + date.toUTCString())
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})