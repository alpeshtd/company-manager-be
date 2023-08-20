const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    amount: Number,
    expenseById: { type: Schema.Types.ObjectId, ref: 'Employee'},
    expenseT: String,
    paidAmount: Number,
    orderId: { type: Schema.Types.ObjectId, ref: 'Order'},
    remainingAmount: Number,
    paymentMode: {              // "cash"/"online"/"gpay"/"phonepay"
        label: String,
        id: String,
        value: String,
    },      
    description: String,
    expenseStatus: {           // "requested"/"pending"/"rejected"/"approved"
        label: String,
        id: String,
        value: String,
    },
    performedById: { type: Schema.Types.ObjectId, ref: 'User'},
    performedT: String,
    expenseConfirmedById: { type: Schema.Types.ObjectId, ref: 'User'},
    changeLog: [String]
})

module.exports = mongoose.model('Expense', expenseSchema);