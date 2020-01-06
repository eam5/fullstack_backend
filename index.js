require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')

const bodyParser = require('body-parser')
const morgan = require('morgan')

app.use(bodyParser.json())

const cors = require('cors')
app.use(cors())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {stream: console.log(process.tiny)}))

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }  
]

app.use(express.static('build'))

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

const generateId = () => {
    return (
        Math.floor(Math.random() * Math.floor(1000))
    )
}

app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (body.name === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }

    const person = new Person ({
        name: body.name,
        number: body.number,
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson.toJSON())
    })
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
      response.json(people.map(person => person.toJSON()))
    })
  })

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
        if (person) {
            response.json(person.toJSON())
        } else {
            response.status(404).end() 
        }
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
    const headerDate = Date()
    console.log(headerDate)
    response.send(
        `<div>
            Phonebook has info for ${persons.length} people <br />
            ${headerDate}
        </div>`
    )
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' })
    } 

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})