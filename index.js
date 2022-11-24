// ==== 24/11/2022, 21.02  ==== dotenv enables using env variables in .env file
require('dotenv').config()
const path = require('path')
const express = require('express')
const app = express()
console.clear()
const Person = require('./models/person')


const cors = require('cors')
app.use(cors())


app.use(express.static('build'))

// ==== 23/11/2022, 20.03  ==== get request to mongo DB p
app.get('/api/persons', (request, response) => {
    console.log('GET made to /api/persons')
    Person.find({}).then(persons => {
        response.json(persons)
    })
})


// ==== 23/11/2022, 20.07  ==== This also works, instead of connecting before
// app.get('/api/persons', (request, response) => {
//     console.log('finding entries...')
//     mongoose
//         .connect(url)
//         .then((result) => {
//             Person.find({}).then(result => {
//                 result.forEach(note => {
//                     console.log(note.name, note.number)
//                 })
//                 mongoose.connection.close()
//             }).catch(err => {
//                 console.log(err)
//             })
//         })
// })

// ==== 18/11/2022, 17.26  ==== calling local json server if no DB is set up
// app.get('/api/persons', (request, response) => {
//     response.json(persons)
// })

// =============== MORGAN
// https://github.com/expressjs/morgan#creating-new-tokens
// app.use(morgan('tiny'))
var morgan = require('morgan')
const { watch } = require('fs')
const { application } = require('express')
// definition af custom token som gør det muligt at modtage "body" i et POST
// request
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.body(req, res) // tilføjelse af body token til logning
    ].join(' ')
})
)
// ===============

// middleware eksempel 1
const requestLogger = (request, response, next) => {
    console.clear()
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(express.json())
// app.use(requestLogger)

app.get('/', (request, response) => {
    response.send('<h1>No static page found. Please build.</h1>')
})

app.get('/info', (request, response) => {
    const payload = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`
    response.send(payload)
})

app.get('/api/persons/:id', (request, response) => {
    console.log(`Get made to /api/notes/${request.params.id}`)
    Person.findById(request.params.id)
      .then(person => {
        if (person) {
          response.json(person)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => {
        console.log(error)
        response.status(400).send({ error: 'malformatted id' })
        console.error('error: malformatted id')
      })
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

// ==== 24/11/2022, 21.37  ==== posting person, using mongoose model Person
// i.e. constructor function for class "Person"
app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(`POST made to /api/persons with ${request.body.name}
    and ${request.body.phone}`)
    
    if (body.name === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }
    const person = new Person({
        name: body.name,
        phone: body.phone,
    })

    console.log('Person is:', person)

    person.save().then(savedPerson => {
        console.log('person saved...')
        response.json(savedPerson)
    })
})

// ==== 24/11/2022, 21.39  ==== app.post('/api/persons') Way of posting person entry before using mongoose
// app.post('/api/persons', (request, response) => {
//     const body = request.body

//     const entry = {
//         name: body.name,
//         phone: body.phone,
//         id: Math.ceil(Math.random() * 1000),
//         timestamp: new Date
//     }
//     if (!entry.name || !entry.phone) {
//         response.status(400).json({
//             error: 'content missing'
//         })
//     }
//     if (persons.find(person => person.name === entry.name)) {
//         console.log('person already exists!')
//         response.status(400).json({
//             error: 'name already exists'
//         })
//     } else {
//         persons = persons.concat(entry)
//         response.json(persons)
//     }

// })

// middleware eksempel 2
// fanger requests der ikke rammer en af vores routes ovf.^
// og smider en 404 fejl

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
    console.log('unknown endpoint')
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})