const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const personName = process.argv[3]
const personNumber = process.argv[4]

const url = `mongodb+srv://alastair7:${password}@fullstackcluster.0jtobdt.mongodb.net/PersonApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Persons = mongoose.model('Person', personSchema)
const person = new Persons({
  name: personName,
  number: personNumber,
})

if (process.argv.length === 5) {
  person.save().then(() => {
    console.log('Person saved.')
    mongoose.connection.close()
  })
}

if (process.argv.length === 3) {
  Persons.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}
