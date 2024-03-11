const mongoose = require('mongoose');
require('dotenv').config()
const mongoURI = process.env.MONGO_DB_URI;
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

const connectToMongo = () => {
    mongoose.connect(mongoURI, connectionParams)
        .then(() => {
            console.log("Connected to Mongo Successfully");
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        })
}

module.exports = connectToMongo;