const { default: mongoose } = require("mongoose");

const noteSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    dateOfCreation: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('note', noteSchema)