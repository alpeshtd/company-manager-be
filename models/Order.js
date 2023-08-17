const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    name: String,
    customer: { type: Schema.Types.ObjectId, ref: 'Customer'},
    orderT: String,
    performedById: { type: Schema.Types.ObjectId, ref: 'User'},
    performedT: String,
    changeLog: [String],
    description: String,
    status: {
        label: String,
        id: String,
        value: String,
    }
});

module.exports = mongoose.model('Order', orderSchema);