const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const incomeSchema = new Schema({
    amount: Number,
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer'},
    transactionType: { type: String, default: 'income' },     // "income"/"purchase"
    orderId: { type: Schema.Types.ObjectId, ref: 'Order'},
    incomeT: String,
    receivedById: { type: Schema.Types.ObjectId, ref: 'Employee'},
    performedById: { type: Schema.Types.ObjectId, ref: 'User'},
    performedT: String,
    description: String,
    paymentMode: {              // "cash"/"online"/"gpay"/"phonepay"
        label: String,
        id: String,
        value: String,
    },
    changeLog: [String]
})

module.exports = mongoose.model('Income', incomeSchema);