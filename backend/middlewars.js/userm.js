const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config();


async function checkusertoken (req,res,next){


    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(400).json({
            success:false,
            message:"No token found"
        })
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token,process.env.JWT_PASSWORD);
        req.id = decoded.id
        console.log("The id is: ",decoded.id)
        next();
    } catch (error) {
        return res.status(500).send({
            success:false,
            messaage:"There is an internal server error",
            error:error
        })
    }

}

module.exports = checkusertoken;