const mongoose = require('mongoose');
const Access = require('./Access');

const Schema = mongoose.Schema;

const userRoleSchema = new Schema({
    name: String,
    access: [{
        label: String,
        id: String,
        value: String,
    }],
    changeLog: [String],
    performedById: { type: Schema.Types.ObjectId, ref: 'User'},
    performedT: String,
});

module.exports = mongoose.model('UserRole', userRoleSchema);