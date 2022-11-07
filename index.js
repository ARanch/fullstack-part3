const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const payload = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`
    response.send(payload)
})

app.get('/api/persons/:id', (request, response) => {
    const person = findPerson(request)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

const findPerson = (request) => {
    const id = Number(request.params.id)
    return person = persons.find(person => person.id === id)
}

app.delete('/api/persons/:id', (request, response) => {
    console.log(persons)
    console.log('request parameter: ', request.params.id)
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    console.log(persons)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    console.clear()
    const body = request.body
    console.log('body is: ', body)
    console.log('pølse')
    
    const entry = {
        name: body.name,
        number: body.number,
        id: Math.ceil(Math.random()*1000),
        timestamp: new Date
    }
    if (!entry.name || !entry.number){
        response.status(400).json({
            error: 'content missing'
        })
    }
    console.log(persons.find(person => person.name === entry.name))
    if (persons.find(person => person.name === entry.name)){
        console.log('person already exists!')
        response.status(400).json({
            error: 'name already exists'
        })
    } else {
        persons = persons.concat(entry)
        response.json(persons)
    }

})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})