const mongoose = require('mongoose')

const ExchangeSchema = new mongoose.Schema({
    id:{
        type: Number,
        unique: true,
    },
    divPrice: {type: [Number]},
    updatedAt: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('Exchange',ExchangeSchema);