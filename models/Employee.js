const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    name: String,
    address: String,
    mobile: String,
    joiningT: String,
    position: String,
    perDay: Number,
    performedById: { type: Schema.Types.ObjectId, ref: 'User'},
    performedT: String,
    changeLog: [String]
})

module.exports = mongoose.model('Employee', employeeSchema);