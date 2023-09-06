require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
morgan.token('person', (req) => {
  return JSON.stringify(req.body)
})

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status - :response-time ms :person'))
app.use(express.static('build'))

const errorHandler = (error, request, response, next) => {
  console.log('Error Handler Middleware accessed')
  console.error(error.message)

  console.log(error.name)
  if (error.name === 'CastError') {
    console.log('Cast Error type')
    return response.status(400).send({ error: 'Malformatted ID' })
  } else if (error.name === 'ValidationError') {
    console.log('Accessing Validation Error')
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((result) => {
      response.json(result)
    })
    .catch((error) => next(error))
})
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => response.json(person))
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  console.log('Body Received:', body)

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Content Missing',
    })
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savedPerson) => {
      console.log('SavedPerson:', savedPerson)
      response.json(person)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

app.get('/info', (request, response) => {
  Person.find({}).then((result) => {
    response.send(`<p>Phonebook has info for ${result.length} people</p>
    <p>${new Date()}</p>`)
  })
})

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
