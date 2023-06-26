const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    body: {
        type: String,
        required: true
    },
    rating: {
        type: Number, 
        required: true
    }
})

module.exports = mongoose.model('Review', reviewSchema);