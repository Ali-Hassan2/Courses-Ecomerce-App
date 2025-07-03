const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken')
dotenv.config();
const adminmiddle = (req,res,next)=>{

    const autheader = req.headers.authorization;

    if(!autheader || !autheader.startsWith("Bearer")){
        return res.status(401).json({
            success:false,
            message:"There is no token provided."
        })
    }

    const token = autheader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_ADMIN_PASSWORD);
        console.log("The token is :",decoded);
        req.adminid = decoded.id;

        next();


    } catch (error) {
        console.log("There is an error.",error);
        return res.status(500).send({
            success:false,
            message:"There is an internal server error.",
            error:error.message,
        })
    }
}

module.exports = {adminmiddle};