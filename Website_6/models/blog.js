const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    snippet: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    valid: {
        type: Boolean,
        requireed: true,
        default: false,
    },
    link: {
        type: String,
        required: false,
    }
}, { timestamps: true })

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;