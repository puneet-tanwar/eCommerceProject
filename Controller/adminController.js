const mongoose = require("mongoose");
// const userModel= require('../schema/userSchema');
const {
  registerUserValidation,
  loginUserValidation,
} = require("../Validation/userValidation");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const userModel = require("../schema/userSchema");
const orderModel = require("../schema/orderSchema");
const cartModel = require("../schema/cartSchema");
const {
  findByIdAndDelete,
  findByIdAndUpdate,
} = require("../schema/userSchema");

dotenv.config();

module.exports.adminHome = async (req, res) => {
  res.send({ msg: "This page is for only Admins" });
};
module.exports.showAllUsers = async (req, res) => {
  try {
    const results = await userModel.find();
    res.send({ msg: "Showing all users", data: results });
  } catch (err) {
    throw err;
  }
};

module.exports.deleteUser = async (req, res) => {
  const UserExists = await userModel.findOne({ Email: req.body.Email });
  if (!UserExists) return res.status(400).send({ msg: "User Does not exists" });
  console.log(UserExists._id.toString());

  try {
    const deletedUser = await userModel.findByIdAndDelete(
      UserExists._id.toString()
    );
    res.send({ msg: "User successfully Deleted", deletedUser: deletedUser });
  } catch (err) {
    res.send({ error: err });
  }
};
module.exports.editUser = async (req, res) => {
  const UserExists = await userModel.findOne({ Email: req.body.Email });
  if (!UserExists) return res.status(400).send({ msg: "User Does not exists" });
  if(UserExists.isAdmin) return res.send({msg: "You can not update info of an ADMIN"});
  // console.log(UserExists._id.toString());

  try {
    const updatedInfo = await userModel.findByIdAndUpdate(
      UserExists._id.toString(),
      req.body.updateInfo
    );
    res.send({ msg: "User successfully updated", updatedUser: updatedInfo });
  } catch (err) {
    res.send({ error: err });
  }
};
module.exports.showAllOrders = async (req, res) => {
  try {
    const allOrders = await orderModel.find();
    res.send({ msg: "All orders shown", orders: allOrders });
  } catch (err) {
    throw err;
  }
};
module.exports.editOrder = async (req, res) => {
  const orderID = req.body.orderID;
  const currOrder = await orderModel.findOne({ _id: orderID });
  if (!currOrder) return res.send({ msg: "order does not exist" });
  try {
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderID,
      req.body.newOrder
    );
    res.send({ msg: "Order updated successfully", newOrder: updatedOrder });
  } catch (err) {
    throw err;
  }
};
module.exports.deleteOrder=async(req,res)=>{
    const orderID= req.body.orderID;
    const orderExists= await orderModel.findById(orderID);
    if(!orderExists) return res.send({msg: "Order does not exists"});
    try{
        const deletedOrder = await orderModel.findByIdAndDelete(orderID);
        res.send({msg: "order is deleted"});
    }catch(err){
        throw err;
    }
}
module.exports.showCart= async(req, res)=>{
    const cart= await cartModel.findOne({belongsTo: req.body.userID});
    const user= await userModel.findById(req.body.userID);
    const userName=user.Name;
    if(!cart) return res.send({msg: "Cart does not exists"});
    else{
        try{
            const products= cart.products;
            res.send({msg: `Showing all products in shopping cart of ${userName}`, products: products})
        }
        catch(err){
            throw err;
        }
    }
}
module.exports.showUserOrders=async(req,res)=>{
    const user = await userModel.findById(req.body.userID);
    const allOrders= await orderModel.find({UserID: req.body.userID});
    if(!user) return res.send({msg: "User does not exists"});
    if(!allOrders) return res.send({msg: "User does not have any orders yet"})
    try{
        res.send({msg:`all orders for ${user.Name}`, ordes: allOrders});
    }
    catch(err){
        throw(err);
    }
}
module.exports.promoteUser=async(req,res)=>{
    const user= await userModel.findById(req.body.userID);
    if(!user) return res.send({msg: "User does not exist"});
    if(user.isAdmin) return res.send({msg: "User is already an ADMIN"});
    try{
        const newAdmin = await userModel.findByIdAndUpdate(user._id,{isAdmin: true});
        res.send({msg: `${user.Name} is ADMIN now`})
    }
    catch(err){
        throw err;
    }
}
module.exports.showCartParams = async (req, res) => {
  const userId = req.query.userId;
  const cart = await cartModel.findOne({ belongsTo: userId });
  const user = await userModel.findById(userId);
  const userName = user.Name;
  if (!cart) return res.send({ msg: "Cart does not exist" });
  else {
    try {
      const products = cart.products;
      res.send({
        msg: `Showing all products in the shopping cart of ${userName}`,
        products: products,
      });
    } catch (err) {
      throw err;
    }
  }
};


// //Validation
// const Joi =require('@hapi/joi');
// //Schema for Validating New Users
// const schema = Joi.object({
//     Name: Joi.string().min(6).required(),
//     Email: Joi.string().min(6).required().email(),
//     Password: Joi.string().min(8).required()
// })

// mongoose
//   .connect("mongodb://127.0.0.1:27017/eCommerce")
//   .then(() => {
//     console.log("connected");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// const home=async(req,res)=>{
//     res.send("home Page");
// }
// const getAll=async(req,res)=>{
//     // res.send("getAll")
//     const users=await userModel.find();
//     res.send(users);
// }

// const registerUser=async(req,res)=>{

//     // Validation
//      const Validation = registerUserValidation(req.body);
//      const ValidationError=Validation.error;
//     if(Validation.error) return res.send({msg: ValidationError.details[0].message});

//     //Checking if the user already exists
//     const emailExists = await userModel.findOne({Email: req.body.Email});
//     if(emailExists) return res.status(400).send({msg: "Email Already exists"});

//     //Hashing the password to secure it
//     const salt = await bcrypt.genSalt(10);
//     const hashPassword=await bcrypt.hash(req.body.Password,salt);

//     const newUser={
//         Name: req.body.Name,
//         Email: req.body.Email,
//         Password: hashPassword
//     }
//     try{
//         const newEntry=new userModel(newUser);
//     await newEntry.save();
//     res.send({msg: "User Registered", info: newEntry});
//     }catch(err){
//         throw err;
//     }

// }
// const loginUser=async(req,res)=>{
//     const Validation = loginUserValidation(req.body);
//      const ValidationError=Validation.error;
//     if(Validation.error) return res.send({msg: ValidationError.details[0].message});

//     //Checking if the user already exists
//     const user = await userModel.findOne({Email: req.body.Email});
//     if(!user) return res.status(400).send({msg: "User with the specified Email does not exist"});

//     //checking password
//     const validPassword= await bcrypt.compare(req.body.Password, user.Password);
//     if(!validPassword) return res.send({msg: "Invalid Password"});

//     //creating and assigning tokens
//     const token = jwt.sign({_id: user._id, isAdmin: user.isAdmin},process.env.USER_TOKEN_SECRET);
//     res.header('auth-token', token);

//     res.send({msg: "logged in"});
// }

// module.exports={
//     home,
//     registerUser,
//     loginUser,
//     deleteUser
// }
