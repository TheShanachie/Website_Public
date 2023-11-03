const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const siteSchema = new Schema({
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

const Site = mongoose.model('Site', siteSchema);
module.exports = Site;