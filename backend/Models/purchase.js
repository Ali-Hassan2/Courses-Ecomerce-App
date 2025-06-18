const mongoose = require('mongoose');
const express = require('express');


const purchaseschema = new mongoose.model('purchase',new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserSchema',
        required:true,
    },
    courseid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'CourseSchema',
        required:true,
    }
},{timestamps:true}));

module.exports = purchaseschema