const mongoose = require('mongoose');
const { bookSchema } = require('../schemas');
const Schema = mongoose.Schema;
const Review = require('./review');

const BookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    image: {
        type: String, 
        required: false
    },
    numOfPages: {
        type: Number, 
        required: false
    },
    description: {
        type: String, 
        required: true
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
})


BookSchema.post('findOneAndDelete', async (doc) => {
    if (doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Book', BookSchema);