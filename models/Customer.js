const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const customerSchema = new Schema({
    name: String,
    mobile: String,
    mail: String,
    address: String,
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order'}],
    changeLog: [String],
    performedById: { type: Schema.Types.ObjectId, ref: 'User'},
    performedT: String,
});

module.exports = mongoose.model('Customer', customerSchema);