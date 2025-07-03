const express = require('express');
const adminSchema = require('../Models/Admin');
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const z = require('zod')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config();
const adminsignup = async (req, res) => {

    const first_name = req.body.first_name?.trim();
    const last_name = req.body.last_name?.trim();
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();


    console.log("The data we got is: ", { first_name, last_name, email, password });
    await Promise.all([
        check('first_name', "first name is required").notEmpty().run(req),
        check('last_name', "Last name is required").notEmpty().run(req),
        check('email', 'Email required.').notEmpty().run(req),
        check('password', "password minlength will be atleast 6").isLength({ min: 6 }).run(req),
    ])

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            success: false,
            message: "There is an error in validation the request",
            error: errors.array(),
        })
    }
    try {
        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Not a complete request."
            })
        }


        const admin = await adminSchema.findOne({ email });
        if (admin) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Admin already exist.",
                }

            )
        }

        const hashedpassword = await bcrypt.hash(password, 10);
        const payload = {
            first_name,
            last_name,
            email,
            password:hashedpassword
        }
        const new_admin = await adminSchema.create(payload);
        new_admin.save();
        return res.status(200).send({
            success:true,
            message:"Admin create",
            new_admin
        })
    } catch (error) {
        console.log("There is an error while creating the admin.",error);
        return res.status(500).send({
            success:false,
            message:"There is internal server error.",
            error:error
        })
    }

}


const adminlogin = async(req,res)=>{
    
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim();
    console.log("The data we got is:",{email,password});
    try {
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"The request is incomplete."
            })
        }
        const admin = await adminSchema.findOne({email});
        if(!admin){
            return res.status(400).json({
                success:false,
                message:"User not exist."
            })
        }
        const ispasswordmatch = await bcrypt.compare(password,admin.password);
        if(!ispasswordmatch){
            return res.status(400).json({
                success:false,
                message:"Invalid credentials"
            })
        }

        const token = jwt.sign(
            {id: admin._id.toString()},
            process.env.JWT_ADMIN_PASSWORD,
            {expiresIn:'30d'}
        )

        const cookieOptions = {
            expiresIn:new Date(Date.now() + 24*60*60*1000),
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:'Strict'
        }

        res.cookie('jwt',token,cookieOptions);

        return res.status(200).json({
            success:true,
            message:"Login Successfull",
            admin:{
                _id:admin._id,
                email:admin.email,
                first_name:admin.first_name,
                last_name:admin.last_name,
            },
            token
        })

    } catch (error) {
        console.log("Login error for admin.",error)
        return res.status(500).send({
            success:false,
            message:"There is an issue while login in the admin",
            error:error.message
        })
    }
}



const adminlogout = async(req,res)=>{
    try {
        if(!req.cookie.jwt){
            return res.status(400).json({
                success:false,
                message:"Please login first."
            })
        }
        res.clearCookie('jwt');
        return res.status(400).json({
            success:true,
            message:"Issue",
        })
    } catch (error) {
        console.log("There is an issue while loggin out and the error is:",error);
        return res.status(500).send({
            success:false,
            message:"There is an issue ",
            error:error.message,
        })
    }
}

module.exports = { adminsignup,adminlogin,adminlogout };