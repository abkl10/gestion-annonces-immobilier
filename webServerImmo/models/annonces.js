const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const annoncesShema = new Schema({
    titre: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['location', 'vente'],
        required: true
    },
    publication: {
        type: Boolean,
        default: false
    },
    statut: {
        type: String,
        enum: ['disponible', 'sold', 'rented'],
        default: 'disponible',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    prix: {
        type: Number,
        required: true
    },
    photos: [String],
    date: {
        type: Date,
        default: Date.now
    },
    questions: [
        {
            text: String,
            username: String,
            date: Date,
            answers: [
                {
                    text: String,
                    username: String,
                    date: Date
                }
            ]
        }
    ]
}, { timestamps: true });
annoncesShema.plugin(mongoosePaginate);
module.exports = mongoose.model('annonces', annoncesShema);