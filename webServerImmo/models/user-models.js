const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const userSchema = new Schema({
    nom: String,
    prenom: String,
    username: String,
    googleId: String,
    password: String,
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
        required: true
    }
})

const User = mongoose.model('user', userSchema);
module.exports = User;