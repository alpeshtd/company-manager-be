const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
    quantity: Number,
    purchaseRate: Number,
    totalAmount: Number,
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor'},
    purchaseById: { type: Schema.Types.ObjectId, ref: 'Employee'},
    purchaseT: String,
    paidAmount: Number,
    orderId: { type: Schema.Types.ObjectId, ref: 'Order'},
    remainingAmount: Number,
    paymentMode: {              // "cash"/"online"/"gpay"/"phonepay"
        label: String,
        id: String,
        value: String,
    },      
    description: String,
    purchaseTypeId: { type: Schema.Types.ObjectId, ref: 'Stock'},   // scrap/others etc
    purchaseStatus: {           // "requested"/"pending"/"rejected"/"approved"
        label: String,
        id: String,
        value: String,
    },
    performedById: { type: Schema.Types.ObjectId, ref: 'User'},
    performedT: String,
    transactionType: { type: String, default: 'purchase' },     // "income"/"purchase"
    purchaseConfirmedById: { type: Schema.Types.ObjectId, ref: 'User'},
    changeLog: [String]
})

module.exports = mongoose.model('Purchase', purchaseSchema);