const axios = require('axios')
const dotenv = require('dotenv');
dotenv.config();

const getresponse = async(req,res)=>{
    const {prompt } = req.body;

    if(!prompt){
        return res.status(402).send({
            success:false,
            message:"Please provide a prompt"
        })
    }
    try{
    const baseURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`

    const geminiResponse = await axios.post(baseURL,{
        contents:[
            {
                parts:[
                    {
                        text:prompt,
                    }
                ]
            }
        ]
    });

    const reply = await geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if(!reply){
        return res.status(400).json({
            success:false,
            message:"No resposne from geminii",
            reply
        })
    }

    return res.status(200).send({
        success:true,
        message:"Data reterived successfully",
        reply
    })
}
catch(error){
    console.log("The error is:",error?.response?.data || error.message);
    return res.status(500).json({
        success:false,
        message:"There is an internal server Error.",
        error:error?.response?.data || error.message
    })
}
}

module.exports = {getresponse}