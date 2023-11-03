const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    date: {
        type: String,
        required: true,
    },
    start_date: {
        type: Date,
        required: true,
    },
    end_date: {
        type: Date,
        required: false,
    },
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: false,
    },
    loc: {
        type: String,
        required: false,
    },
    order_no: {
        type: BigInt,
        required: true,
    }
}, { timestamps: true })

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;