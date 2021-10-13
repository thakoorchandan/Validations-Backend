const express = require("express");
const {body, validationResult} = require("express-validator")
const User = require("../models/user.model")

const router = express.Router();

//------- GET "/users" ---------
router.get("/", async(req,res)=>{
    try{
        const user = await User.find().lean().exec();
        return res.status(200).send(user);
    } catch(err){
        return res.status(400).send(err.message)
    }
})

//-------- POST "/users" --------
router.post("/",
body("first_name").notEmpty().withMessage("First Name is required"),
body("last_name").notEmpty().withMessage("Last Name is required"),
body("email").notEmpty().isEmail().withMessage("Email is required and should be a valid email address"),
body("pincode").notEmpty().isLength({min:6,max:6}).withMessage("Pincode should must be 6 digits"),
body("age").notEmpty().custom(value=>{
    if(value>0 && value<=100){
        return true
    }
}).withMessage("Please Enter Age between 1 to 100"),
body("gender").notEmpty().custom(value=>{
    if(value == "male"){
        return true
    } else if(value == "female"){
        return true
    } else{
        return false
    }
}).withMessage("Gender must be specified as Male or Female"),
async (req,res)=>{
    const errors = validationResult(req);
    let finalErrors = null;
    if(!errors.isEmpty()){
        finalErrors = errors.array().map(error=>{
            return {
                param: error.param,
                msg: error.msg,
            }
        })
        return res.status(400).json({Errors: finalErrors})
    }
    try{
        const user = await User.create(req.body);
        return res.status(200).send(user)
    } catch(err){
        return res.status(400).send(err.message)
    }  
})

//---------- PATCH "/users" --------
router.patch("/:id", 
async (req,res)=>{
    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new:true}).lean();
        return res.status(200).send(user)
    }catch{
        return res.status(400).send(err.message);
    }
})

//---------- DELETE "/users" -----------
router.delete("/:id",async (req,res)=>{
    try{
    const user = await User.findByIdAndDelete(req.params.id, req.body).lean();
    return res.status(200).send(user);
    } catch(err){
        return res.status(400).send(err.message)
    }
})

module.exports = router;