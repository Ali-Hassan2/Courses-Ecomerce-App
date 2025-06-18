const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const colors = require('colors');
const morgan = require('morgan');
const connectdb = require('./Config/db')
const app = express();
const courseroute = require('./Routes/CourseRoute');
const fileUpload = require('express-fileupload');
const userroute = require('./Routes/userRoute')
const cloudinary = require('cloudinary').v2;

dotenv.config();
const port = process.env.PORT || 4002

// middlewares
app.use(express.json())
app.use(cors());
app.use(morgan('dev'));
app.use(fileUpload({
    useTempFiles: true, 
    tempFileDir: '/tmp/',
    limits: { fileSize: 50 * 1024 * 1024 },
}));



// defining routes
app.use('/cs/course',courseroute);
app.use('/auth/',userroute)




// Cloudinary Configuration
cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret 
});


app.get('/',(req,res)=>{res.send("Hello from server")});

const startServer = ()=>{
    return new Promise((resolve,reject)=>{
        try {
            connectdb();
            const server = app.listen(port,()=>{
                console.log(colors.bgBlack.green(`The Server is Running at port: ${port}`));
                resolve(server);
            })
        } catch (error) {
            console.log(colors.bgBlack.red("There is an error: ",error));
            reject(error);
        }
    })
}

startServer();