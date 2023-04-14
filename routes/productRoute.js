const express = require('express');
const router = express.Router();
const verifyUser= require('../middlewares/verifyToken');
const verifyAdmin=require('../middlewares/verifyAdmin');
const productController=require('../Controller/productController');

router.get('/',verifyUser,(req,res)=>{
    res.json({posts: "Only for verified Users"});
})

// router.post('/addNewProduct',verifyAdmin,async(req,res)=>{
//     res.json({msg: "Create Products: You are an admin"});
// })
// router.get('/getProduct/:productID',verifyUser, productController.getSpecificProduct);
router.post('/addNewProduct', verifyAdmin,productController.createProducts);
router.post('/addMultipleProducts',verifyAdmin,productController.createMultipleProducts);
router.delete('/deleteProduct',verifyAdmin, productController.deleteProduct);
router.get('/getAll',verifyUser,productController.getAllProducts);
router.put('/editProduct', verifyAdmin, productController.editProduct);
router.post('/orderProduct', verifyUser, productController.orderProduct);
router.post('/addToCart',verifyUser,productController.addToCart);
router.post('/addProductToWishList', verifyUser, productController.addProductToWishList);
router.put('/removeProductFromWishList', verifyUser, productController.removeProductFromWishList);
router.get('/getAllProducts',productController.getAllProducts);
router.get('/getRelatedProducts',productController.getRelatedProducts);
router.get('/findProductByTag',productController.findProductByTag);
router.patch('/addTagToProduct',verifyAdmin,productController.addTag);


module.exports=router;