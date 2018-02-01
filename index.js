const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('data', function getData(req) {
    return JSON.stringify(req.body)
})

app.use(cors())
app.use(bodyParser.json())
//app.use(morgan('tiny'))
app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))
app.use(express.static('build'))

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

// const formatPerson = (person) => {
//     return {
//         name: person.name,
//         number: person.number,
//         id: person._id
//     }
// }

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(persons => {
            res.json(persons.map(Person.format))
        })
        .catch(error => {
            console.log(error)
        })
})

app.get('/api/persons/:id', (req, res) => {
    Person
        .findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(Person.format(person))
            } else {
                res.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

app.delete('/api/persons/:id', (req, res) => {
    Person
        .findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => {
            res.status(400).send({ error: 'malformatted id' })
        })
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.name === undefined || body.number === undefined) {
        return res.status(400).json({ error: 'content missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    console.log(person)

    Person
        .findOne({ name: body.name })
        .then(response => {
            console.log("res", response)
            if (!response) {
                person
                    .save()
                    .then(savedPerson => {
                        res.status(200).json(Person.format(person))
                    })
                    .catch(error => {
                        res.status(400).send({ error: 'malformatted id' })
                    })
            } else {
                res.status(400).send({error: 'name already in database'})
            }
        })


})

app.put('/api/persons/:id', (req, res) => {
    const body = req.body

    if (body.name === undefined || body.number === undefined) {
        return res.status(400).json({ error: 'content missing' })
    }
    console.log("body", body)
    Person
        .findByIdAndUpdate(req.params.id, { number: body.number }, { new: true })
        .then((response) => {
            res.status(200).send(response)
        })
        .catch(error => {
            res.status(400).send({ error: 'malformatted id' })
        })
})

app.get('/info', (req, res) => {
    Person
        .find({})
        .then(persons => {
            let text = "puhelinluettelossa " + persons.length + " henkilön tiedot"
            let date = new Date()
            res.status(200).send(text + '<br></br>' + date.toUTCString())
        })
        .catch(error => {
            console.log(error)
        })

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})