const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    type: String,
    data: { type: Schema.Types.ObjectId, refPath: 'type' },
    unread: Boolean,
    time: String
})

module.exports = mongoose.model('Notifiaction', notificationSchema);