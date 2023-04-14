const express = require('express');
const router = express.Router();
const UserController = require('../Controller/userController');
const verifyUser=require("../middlewares/verifyToken");

router.get("/", UserController.home)
router.post("/registerUser", UserController.registerUser);
router.post("/loginUser", UserController.loginUser);
router.put("/editSelf",verifyUser, UserController.editSelf);
router.get("/getTotalAmountToBePaid",verifyUser,UserController.getTotalAmount);
router.get("/getUserDetails",verifyUser,UserController.getUserDetails) // <<==== Sensitive Route
router.get("/getMyOrders",verifyUser,UserController.getMyOrders);
router.delete("/deleteOrder",verifyUser, UserController.deleteOrder);   
router.get("/showSelfCart",verifyUser,UserController.getMyCart);
router.get("/showSelfWishlist",verifyUser,UserController.getMyWishlist);
module.exports=router;
