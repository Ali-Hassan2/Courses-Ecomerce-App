const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    image: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        }
       
    },
    creator:{
        type:String,
        required:true
    }

},{timestamps:true});

const CourseSchema = mongoose.model('CourseSchema', courseSchema);

module.exports = CourseSchema;
