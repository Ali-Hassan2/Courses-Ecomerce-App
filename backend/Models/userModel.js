    const mongoose = require('mongoose');



    const User = new mongoose.model('UserSchema', new mongoose.Schema({
        first_name:{
            type:String,
            required:true,
        },
        last_name:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:true,
            
        }
    },{timestamps:true}));

    module.exports = User