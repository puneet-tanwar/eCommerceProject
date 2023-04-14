const express = require("express");
const router = express.Router();
const adminController = require("../Controller/adminController");
const verifyAdmin = require("../middlewares/verifyAdmin");

router.get("/", verifyAdmin, adminController.adminHome);
router.get("/getAllUsers", verifyAdmin, adminController.showAllUsers);
router.delete("/deleteUser", verifyAdmin, adminController.deleteUser);
router.put("/editUser", verifyAdmin, adminController.editUser);
router.get("/showAllOrders", verifyAdmin, adminController.showAllOrders);
router.put("/editOrder", verifyAdmin, adminController.editOrder);
router.delete("/deleteOrder", verifyAdmin, adminController.deleteOrder);
router.get("/showUsersCart", verifyAdmin, adminController.showCart);
router.get("/showUsersCartParams", verifyAdmin, adminController.showCartParams);
router.get("/getAllOrderForUser", verifyAdmin, adminController.showUserOrders);
router.put("/promoteUser", verifyAdmin, adminController.promoteUser);

module.exports = router;
