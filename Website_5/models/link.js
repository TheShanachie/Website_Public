const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const linkSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    order_no: {
        type: BigInt,
        required: true,
    }
}, { timestamps: true })

const Link = mongoose.model('Link', linkSchema);
module.exports = Link;