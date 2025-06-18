const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors')
dotenv.config();

const connectdb = async ()=>{
    try {
        const uri = process.env.CONNECTION_STRING;
        if(!uri) throw new Error(colors.bgBlack.red("There is no connection string.")), process.exit(1);
        await mongoose.connect(uri,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log(colors.bgBlack.green("MONGO DB CONNECTED."))
    } catch (error) {console.log(colors.bgBlack.red("There is an error.")); process.exit(1)}
}

module.exports = connectdb;