const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const stockSchema = new Schema({
    type: String,
    quantity: Number,
    unit: String,
    rate: Number,
    changeLog: [String],
    performedById: { type: Schema.Types.ObjectId, ref: 'User'},
    performedT: String,
})

module.exports = mongoose.model('Stock', stockSchema);