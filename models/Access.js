const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const accessSchema = new Schema({
    label: String,
    id: String,
    value: String,
})

module.exports = mongoose.model('Access', accessSchema);