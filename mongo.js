const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0-0z2fg.mongodb.net/phonebook-app?retryWrites=true&w=majority
  `

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })

const name = process.argv[3]
const number = process.argv[4]
const generateId = () => {
  return (
      Math.floor(Math.random() * Math.floor(1000))
  )
}

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: `${name}`,
  number: `${number}`,
  id: generateId(),
})



if (process.argv.length==3) {
  Person
  .find({})
  .then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
  })
  mongoose.connection.close()
})
} else if (process.argv.length==5) {
  person
  .save()
  .then(response => {
  console.log(`Added ${name} number ${number} to phonebook`)
  mongoose.connection.close()
})
} else {
  console.log('enter arguments: password name number')
  process.exit(1)
}
