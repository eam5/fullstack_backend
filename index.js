const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

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

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)
    console.log(person)

    response.json(person)
})

app.get('/api/persons/', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    const person = persons.find(person => {
        console.log(person.id, typeof person.id, id, typeof id, person.id === id)
        return person.id === id
    })

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
    console.log(person) 
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

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})