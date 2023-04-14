const mongoose = require("mongoose");
const userModel = require("../schema/userSchema");
const cartModel = require("../schema/cartSchema");
const {
  registerUserValidation,
  loginUserValidation,
} = require("../Validation/userValidation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const decode = require("jwt-decode");

dotenv.config();

//Validation
const Joi = require("@hapi/joi");
const { findByIdAndUpdate } = require("../schema/userSchema");
const orderModel = require("../schema/orderSchema");
const wishlistModel = require("../schema/wishListSchema");
//Schema for Validating New Users
// const schema = Joi.object({
//     Name: Joi.string().min(6).required(),
//     Email: Joi.string().min(6).required().email(),
//     Password: Joi.string().min(8).required()
// })

mongoose
  .connect("mongodb://127.0.0.1:27017/eCommerce")
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

const home = async (req, res) => {
  res.send("home Page");
};
// const getAll=async(req,res)=>{
//     // res.send("getAll")
//     const users=await userModel.find();
//     res.send(users);
// }

const registerUser = async (req, res) => {
  console.log(req.body);
  // Validation
  const Validation = registerUserValidation(req.body);
  const ValidationError = Validation.error;
  if (Validation.error)
    return res.send({ msg: ValidationError.details[0].message });

  //Checking if the user already exists
  const emailExists = await userModel.findOne({ Email: req.body.Email });
  if (emailExists) return res.status(400).send({ msg: "Email Already exists" });

  //Hashing the password to secure it
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.Password, salt);

  const newUser = {
    Name: req.body.Name,
    Email: req.body.Email,
    Password: hashPassword,
  };
  try {
    const newEntry = new userModel(newUser);
    await newEntry.save();
    res.send({ msg: "User Registered", info: newEntry });
  } catch (err) {
    throw err;
  }
};
const loginUser = async (req, res) => {
  const Validation = loginUserValidation(req.body);
  const ValidationError = Validation.error;
  if (Validation.error)
    return res.send({ msg: ValidationError.details[0].message });

  //Checking if the user already exists
  const user = await userModel.findOne({ Email: req.body.Email });
  if (!user) {
    console.log("User does not exists");
    return res
      .status(400)
      .send({ msg: "User with the specified Email does not exist" });
  }

  //checking password
  const validPassword = await bcrypt.compare(req.body.Password, user.Password);
  if (!validPassword) {
    console.log("Invalid Password");
    return res.status(400).send({ msg: "Invalid Password" });
  }

  //creating and assigning tokens
  const token = jwt.sign(
    { _id: user._id, isAdmin: user.isAdmin },
    process.env.USER_TOKEN_SECRET
  );
  res.header("auth-token", token);
  // req.headers['auth-token']= token;
  res.cookie("jwt", token, { httpOnly: true });
  res.send({ msg: "logged in", verifiedEmail: req.body.Email, jwt: token }); //  <===== !!!! Sending JWT token in response
};
const editSelf = async (req, res) => {
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      req.body
    );
    res.send({ msg: "Your updation is successful", updatedUser: updatedUser });
  } catch (err) {
    throw err;
  }
};

const getTotalAmount = async (req, res) => {
  const allOrdersOfTheUser = await orderModel.find({ UserID: req.user._id });
  const totalAmount = allOrdersOfTheUser.reduce((total, order) => {
    return total + parseInt(order.OrderTotal);
  }, 0);
  console.log(totalAmount);
  res.send({ totalOrder: totalAmount });
  // res.send(totalAmount);
};
const getUserDetails = async (req, res) => {
  // <---- !!!!sending user details ( Might be unsafe ??)
  const user = await userModel.findById(req.user._id);
  if (!user) return res.send({ msg: "user does not exist" });
  // console.log(user)
  res.send({ user: user });
};
const getMyOrders = async (req, res) => {
  const user = req.user;
  const allOrdersOfTheUser = await orderModel
    .find({ UserID: req.user._id })
    .sort({ createdAt: -1 });
  //   console.log(user);
  res.send({ msg: "all orders", orders: allOrdersOfTheUser });
};
const deleteOrder = async (req, res) => {
  const userID = req.user._id;
  const productID = req.body.productID;
  orderModel.deleteOne({  UserID: userID, ProductID: productID }).then((response)=>{
    res.send(response);
  });
};


const getMyCart = async (req, res) => {
  const user = req.user;
  const allProductsinCart = await cartModel.find({ belongsTo: user._id });
  res.send({ msg: "cart of user", cart: allProductsinCart });
};
const getMyWishlist = async (req, res) => {
  const user = req.user;
  const wishlist = await wishlistModel.find({ belongsTo: user._id });
  res.send({ msg: "wishlist of user", wishlist: wishlist });
};
module.exports = {
  home,
  registerUser,
  loginUser,
  editSelf,
  getTotalAmount,
  getUserDetails,
  getMyOrders,
  deleteOrder,
  getMyCart,
  getMyWishlist,
};
