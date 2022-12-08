// ==== 24/11/2022, 21.02  ==== dotenv enables using env variables in .env file
require('dotenv').config()
const path = require('path')
const express = require('express')
const app = express()
console.clear()
const Person = require('./models/person')


const cors = require('cors')
app.use(cors())

// middleware eksempel 1
const requestLogger = (request, response, next) => {
    console.clear()
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
app.use(express.json()) // https://www.geeksforgeeks.org/express-js-express-json-function/
app.use(requestLogger)
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
const { brotliDecompressSync } = require('zlib')
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

app.get('/', (request, response) => {
    response.send('<h1>No static page found. Please build.</h1>')
})

app.get('/info', (request, response) => {
    console.log('GET made to /info')
    Person.find({}).then(persons => {
        response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204)
        })
        .catch(error => next(error))
})
// ==== 28/11/2022, 21.12  ==== update number of person
app.put('/api/persons/:id', (request, response, next) => {
    console.log('put request to api/persons/', request.params.id)
    const body = request.body
    const person = {
        name: body.name,
        phone: body.phone
    }
    console.log(request.body, request.params.id)
    Person.findByIdAndUpdate(
        request.params.id,
        person,
        { new: true, runValidators: true, context: 'query'  } // mongoose schema validation køres ikke default af findByIdAndUpdate, derfor tilføres det her
    ).then(updatedPerson => {
        response.json(updatedPerson)
    }).catch(error => next(error))
})

// ==== 24/11/2022, 21.37  ==== posting person, using mongoose model Person
// i.e. constructor function for class "Person"
app.post('/api/persons', (request, response, next) => {
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

    person.save()
        .then(savedPerson => {
            console.log('person saved...')
            response.json(savedPerson)
        })
        .catch(error => next(error)) // calls the errorHandler function, following would also work: errorHandler(error, request, response, next
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
    console.log('unknown endpoint')
}

app.use(unknownEndpoint)

// error handler bliver kaldt af next(error) funktionerne, i de 
// forskellige route-handlers ovf. Hvis next() kaldes uden parameter
// vil den bare sende videre til næste route eller middleware - men med
// parameter bliver det en errorhandler
const errorHandler = (error, request, response, next) => {
    // ==== 24/11/2022, 23.43  ==== https://expressjs.com/en/guide/error-handling.html
    // ==== 28/11/2022, 20.58  ==== "Moving error handling into middleware" - https://fullstackopen.com/en/part3/saving_data_to_mongo_db
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    if (error) {

        return next(error)
    }

}

// ==== 24/11/2022, 23.41  ==== !!
// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})