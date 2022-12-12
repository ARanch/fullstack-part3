// ==== 18/11/2022, 16.53  ==== task: node mongo.js yourpassword Anna 040-1234556 adds
// ==== 18/11/2022, 16.54  ==== task: node mongo.js yourpassword prints content of db

const mongoose = require('mongoose')
if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

// ==== 18/11/2022, 15.11  ==== MongoDB password (big nono in real app)
// oBVfLhfTtMSXJ6Au
// ==== 18/11/2022, 15.08  ==== environment var passed via >> "node mongo <password>"
const password = process.argv[2]

// ==== 18/11/2022, 15.09  ==== you can create a new mongodb by replacing 'phonebook' btw. / and ?
const url = `mongodb+srv://rango:${password}@cluster0.nvul2ly.mongodb.net/phonebook?retryWrites=true&w=majority`


// ==== 18/11/2022, 15.06  ==== mongoose schema for forming note
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

// ==== 18/11/2022, 15.07  ==== mongoose model 'note'
const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    // ==== 18/11/2022, 16.59  ==== if no name was passed to call, show content of DB
    console.log('finding stuff...')
    mongoose
        .connect(url)
        .then(() => {
            Person.find({}).then(result => {
                result.forEach(note => {
                    console.log(note.name, note.number)
                })
                mongoose.connection.close()
            }).catch(err => {
                console.log(err)
            })
        })
} else if (process.argv.length === 5) {
    // ==== 18/11/2022, 16.59  ==== if a name was passed to call
    // ==== 18/11/2022, 15.07  ==== saving phonenumber to mongodb via mongoose
    mongoose
        .connect(url)
        .then(() => {
            console.log('connected')

            const person = new Person({
                name: process.argv[3],
                number: process.argv[4],
            })
            return person.save()
        })
        .then(() => {
            console.log('name and number saved to!')
            return mongoose.connection.close()
        })
        .catch((err) => console.log(err))
} else if (process.argv.length === 4 || process.argv.length > 5) {
    console.error('Either too little, or too much info was passed.')
}
// ==== 18/11/2022, 15.10  ==== print all notes from database