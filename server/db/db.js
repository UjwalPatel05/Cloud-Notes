const mongoose = require('mongoose')
const mongooseURI = process.env.MONGO_URI


const connectToMongo = async() => {
    mongoose.connect(mongooseURI).then(() => {
        console.log("Connect to Database");
    }).catch((err) => {
        console.log(err);
    });
}

module.exports = connectToMongo