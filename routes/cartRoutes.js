const express = require('express');
const router = express.Router();
const verifyUser= require('../middlewares/verifyToken');
const verifyAdmin=require('../middlewares/verifyAdmin');
const productController=require('../Controller/productController');
const cartController=require('../Controller/cartController');
router.get('/',verifyUser,(req,res)=>{
    res.json({posts: "Shopping Cart Only for Authenticated Users"});
})
router.delete('/deleteItemFromCart',verifyUser, cartController.deleteItem);
// router.post("/orderProduct",verifyUser,cartController.orderProduct);
// router.post('/addNewProduct',verifyAdmin,async(req,res)=>{
//     res.json({msg: "Create Products: You are an admin"});
// })
// router.post('/addNewProduct', verifyAdmin,productController.createProducts);
// router.delete('/deleteProduct',verifyAdmin, productController.deleteProduct);
// router.get('/getAll',verifyUser,productController.getAllProducts);
// router.put('/editProduct', verifyAdmin, productController.editProduct);
// router.post('/orderProduct', verifyUser, productController.orderProduct);

module.exports=router;