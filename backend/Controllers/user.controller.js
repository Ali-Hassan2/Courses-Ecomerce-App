const User = require('../Models/User');
const bcrypt = require('bcrypt');
const z = require('zod');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const purchaseschema = require('../Models/purchase');
const CourseSchema = require('../Models/CourseModel');
dotenv.config();

const signup = async(req,res)=>{


    const {first_name,last_name,email,password} = req.body;
    console.log("The data we got is: ",{first_name,last_name,email,password})

    const userSchema = z.object({
        first_name:z.string().min(6,{message:"first_name must b at least 6 characters long"}),
        last_name: z.string().min(6,{message:"lastname should be atleast 6 charactes long."}),
        email:z.string().email(),
        password:z.string().min(6,{message:"Must be atleast 6 characters be in password."})

    })
    
    const validatedData = userSchema.safeParse(req.body);
    if(!validatedData){
        return res
        .status(400)
        .send({errors: validatedData.error.issue.map((err)=>err.message)});
    }


    try {
        if(!first_name || !last_name || !email || !password){
            return res.status(400).send({
                success:false,
                message:"Uncomplete request"
            })
        }
        const user = await User.findOne({email:email});
        if(user){
            return res.status(400).json({
                success:false,
                message:"User already exist."
            })
        }

        const hashedpassword = await bcrypt.hash(password,10);
        const payload = {
            first_name,
            last_name,
            email,
            password:hashedpassword,
        }
        const new_user = new User(payload);
        new_user.save();
        return res.status(200).send({
            success:true,
            message:"The user successfully created.",
            user
        })
    } catch (error) {
        console.log("There is an error.",error);
        return res.status(500).json({
            success:false,
            message:"Internal server error",
            error:error,
        })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Received credentials:', { email, password });

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }
 
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials."
            });
        }

        const token = jwt.sign(
            { id: user._id.toString() }, 
            process.env.JWT_PASSWORD,
            { expiresIn: '7d' } 
        );

        const cookieOption={
            expires:new Date(Date.now() + 24*60* 1000),
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"Strict"
        }

        res.cookie('jwt', token, cookieOption);

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            user: {
                _id: user._id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
            },
            token
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        });
    }
};


const logout = async(req,res)=>{
    try {
        if(!req.cookie.jwt){
            return res.status(400).json({
                success:false,
                message:"Please login first",
            })
        }
        res.clearCookie('jwt');
        return res.status(200).json({
            success:true,
            message:"Logout successfull"
        })
    } catch (error) {
        console.log("There is an error while logging out.",error);
        return res.status(500).send({
            success:false,
            message:"Internal Server error",
            error:error
        })
    }
}



const purchasedcourses = async (req,res)=>{

    const id = req.id;

    if(!id){
        return res.status(400).json({
            success:false,
            message:"No id is provided"
        })
    }
    try {
        const purchased = await purchaseschema.find({userid:id});
        const courseid = purchased.map((item) => item.courseid);
        const courses = await CourseSchema.find({
            _id:{$in:courseid},
        })
        return res.status(200).send({
            success:true,
            message:"Courses found",
            purchasedcourses:courses
        })
    } catch (error) {
        console.log("There is an error.",error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error.",
            error:error
        })
    }

  
  }




module.exports = {signup, login, logout, purchasedcourses};