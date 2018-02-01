const mongoose = require('mongoose')
const Schema = mongoose.Schema

const url = 'mongodb://Vanamo:database@ds119988.mlab.com:19988/puhelinluettelo'

mongoose.connect(url)
mongoose.Promise = global.Promise

const personSchema = new Schema({
    name: String,
    number: String
})

personSchema.statics.format = function(person) {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}

const Person = mongoose.model('Person', personSchema)


module.exports = Person
