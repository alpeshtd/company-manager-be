const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const utilizationSchema = new Schema({
    stockId: { type: Schema.Types.ObjectId, ref: 'Stock'},
    quantity: Number,
    rate: Number,
    utilizationById: { type: Schema.Types.ObjectId, ref: 'Employee'},
    utilizationT: String,
    orderId: { type: Schema.Types.ObjectId, ref: 'Order'},
    utilizationStatus: {
        label: String,
        id: String,
        value: String,
    },
    performedById: { type: Schema.Types.ObjectId, ref: 'User'},
    performedT: String,
    description: String,
    changeLog: [String]
})

module.exports = mongoose.model('Utilization', utilizationSchema);