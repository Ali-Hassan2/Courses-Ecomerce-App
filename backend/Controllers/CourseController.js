const CourseSchema = require('../Models/CourseModel');
const cloudinary = require('cloudinary').v2;
const purchaseschema = require('../Models/purchase')
const mongoose = require('mongoose');
const creatingcourse = async (req, res) => {
  const adminid = req.adminid;
  try {
    const { title, description, price } = req.body;
    console.log("The data we got is: ", { title, description, price });

    if (!title || !description || !price) {
      return res.status(400).json({
        success: false,
        message: "There is not a complete request"
      });
    }

    const {image} = req.files;

    if(!req.files || Object.keys(req.files).length ===0){
        res.status(400).json({
            success:false,
            message:"No images found."
        })
    }

    const allowedformat = ["image/png","image/jpeg"];
    if(!allowedformat.includes(image.mimetype)){
        return res.status(400).send({
            success:false,
            message:"The format is not allowed"
        })
    }

    // cloudinory code
    const uploadResult = await cloudinary.uploader
       .upload(image.tempFilePath);
    if(!uploadResult || uploadResult.error){
        res.status(400).json({
            success:false,
            message:"there is an error while uploading image"
        })
    }
    
    const payload = {
      title,
      description,
      price,
      image:{
        public_id:uploadResult.public_id,
        url:uploadResult.url
      },
      creator:adminid,
    };

    const course = await CourseSchema.create(payload);
    console.log("The course is created.");

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data:course
    });

  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating course",
    });
  }
};




const updatingcourse = async (req, res) => {
  const adminid = req.adminid;
  try {
    const { id } = req.params;
    console.log("The course id is:", id);
    const { title, description, price, image } = req.body;
    console.log("The data is: ", { title, description, price, image });

    if (!id || !title || !description || !price) {
      console.log("There is missing data in the request.");
      return res.status(400).send({
        success: false,
        message: "Missing required fields or course ID.",
      });
    }
    const courseSearch = await CourseSchema.findById({
      _id:id,
      creator:adminid
    })

    if(!courseSearch){
      return res.status(400).json({
        success:false,
        message:"There is no such course.",
      })
    }
 
    const course = await CourseSchema.updateOne(
      { _id: id,
        creator:adminid
       },
      {
        title,
        description,
        price,
        image: {
          public_id: image?.public_id,
          url: image?.url,
        },
      }
    );


    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    console.log("Error while updating course:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};


const deletingcourse = async (req, res) => {
  const { id } = req.params;
  const adminid = req.adminid;
  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "No course ID specified.",
      });
    }




    const result = await CourseSchema.deleteOne({ _id: id,
      creator:adminid
     });

    console.log("Delete result:", result);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found or already deleted.",
      });
    }



    return res.status(200).json({
      success: true,
      message: "Course successfully deleted.",
    });
  } catch (error) {
    console.error("Error while deleting course:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting course.",
      error: error.message,
    });
  }
};


const gettingcourse = async(req,res)=>{

  try {
    const courses = await CourseSchema.find({});
    return res.status(201).json({
      success:true,
      message:"Course founded successfully.",
      data:courses
    })

    if(!courses){
      return res.status(400).json({
        success:false,
        message:"There are no course in the server."
      })
    }
  } catch (error) {
    console.log("There is an error while getting the courses");
    return res.status(500).send({
      success:false,
      message:"There is an issue at the backend.",
      error:error
    })
  }

}


const getcoursedetails = async(req,res)=>{

    try {
      const {id} = req.params;
      if(!id){
        return res.statu(401).send({
          success:false,
          message:"There is no course id here."
        })
      }
      const course = await CourseSchema.findById({
        _id:id
      })
      if(!course){
        return res.status(400).json({
          success:false,
          message:"There is no such course."
        })
      }
      return res.status(200).send({
        success:true,
        message:"We got the couese",
        data:course,
      })
    } catch (error) {
      console.log("There is an error.",error);
      return res.status(500).send({
        success:false,
        message:"There is interval server error.",
        error:error
      })
    }

}

const buycourse = async (req, res) => {
  const userId = req.id; 
  const { courseid } = req.params;

  console.log("The user id is:", userId);
  console.log("The course id is:", courseid);

  try {
    if (!mongoose.Types.ObjectId.isValid(courseid)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await CourseSchema.findById(courseid);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const existingPurchase = await purchaseschema.findOne({
      courseid,
      userid: userId
    });

    if (existingPurchase) {
      return res.status(400).json({
        success: false,
        message: "Course already purchased",
      });
    }

    const newPurchase = new purchaseschema({
      courseid,
      userid: userId,
    });

    await newPurchase.save();

    return res.status(200).json({
      success: true,
      message: "Course purchased successfully",
      purchase: newPurchase,
    });

  } catch (error) {
    console.error("Error while buying course:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


module.exports = { creatingcourse, updatingcourse,
   deletingcourse, gettingcourse, getcoursedetails, buycourse };
