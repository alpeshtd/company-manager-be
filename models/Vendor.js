const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const vendorSchema = new Schema({
    name: String,
    mobile: String,
    mail: String,
    address: String,
    purchases: [{ type: Schema.Types.ObjectId, ref: 'Purchase'}],
    changeLog: [String],
    performedById: { type: Schema.Types.ObjectId, ref: 'User'},
    performedT: String,
});

module.exports = mongoose.model('Vendor', vendorSchema);