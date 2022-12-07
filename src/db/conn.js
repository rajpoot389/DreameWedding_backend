const mongoose = require('mongoose');
const path = require('path')
const dotenv = require('dotenv');
const { strict } = require('assert');
const envPath = path.join(__dirname, "./config.env");
dotenv.config({ path: envPath });
const DB = process.env.DATABASE;


console.log(DB);
mongoose.connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false

}).then(() => {
    console.log("Connection Successfull In MongoDb");
}).catch((e) => {
    console.log(e);
})



