// ========================================================
// ==== 18/11/2022, 17.19  ==== MONGO DB definitions
const mongoose = require('mongoose')
// ==== 18/11/2022, 17.25  ==== REPLACEW WITH PROCESS VAR

// ==== 18/11/2022, 15.09  ==== you can create a new mongodb by replacing 'phonebook' btw. / and ?
const url = process.env.MONGODB_URI
console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
// ==== 23/11/2022, 20.05  ==== CONNECTING to mongo here, missed that in first implementation
mongoose.connect(url)
// ==== 18/11/2022, 15.06  ==== mongoose schema for forming note
const personSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      minLength: 8,
      required: true
    }
  })
  // name: String, //simpel måde at definere validation, hvor det ikke er et objekt
  // phone: String 
// ==== 23/11/2022, 20.23  ==== modified schema, removing mongo ID and version
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        // transform returned ID into a string (because mongo dB's ID actually is an object!)
        returnedObject.id = returnedObject._id.toString()
        // delete object based ID
        delete returnedObject._id
        // delete version number
        delete returnedObject.__v
    }
})
// ==== 18/11/2022, 15.07  ==== mongoose model 'person'
const Person = mongoose.model('Person', personSchema)

// variables like "mongoose" or "url" are not accessible to the user of
// the module!
module.exports = mongoose.model('Person', personSchema)