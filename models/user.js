const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserAdminSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        role: {
            type: String,
            default: 'pending',
            enum: [
                'admin',
                'authenticated',
                'pending'
            ]
        }
    }
    ,
    {
        collection: 'users'
    }
)

module.exports = mongoose.model('User', UserAdminSchema)