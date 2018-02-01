const mongoose = require('mongoose')

const url = 'mongodb://Vanamo:database@ds119988.mlab.com:19988/puhelinluettelo'

mongoose.connect(url)
mongoose.Promise = global.Promise

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

if (process.argv.length === 4) {
    const person = new Person({
        name: process.argv[2],
        number: process.argv[3]
    })

    person
        .save()
        .then(response => {
            console.log('lisätään henkilö', person.name, 'numero', 
                person.number, 'luetteloon')
            mongoose.connection.close()
        })
} else {
    Person
        .find({})
        .then(result => {
            console.log('puhelinluettelo:')
            result.forEach(person => {
                console.log(person.name, person.number)
            })
            mongoose.connection.close()
        })
}
