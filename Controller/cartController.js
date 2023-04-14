const productModel = require("../schema/productSchema");
const orderModel = require("../schema/orderSchema");
const cartModel = require("../schema/cartSchema");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const { findByIdAndUpdate, findById } = require("../schema/userSchema");

dotenv.config();

module.exports.deleteItem = async (req, res) => {
  const cart = await cartModel.findById(req.body.cartID);
  
  try {
    if (req.user._id == cart.belongsTo) {
        // functionality to be added: check if the item exists already
        // const itemExists= await cartModel.find({products: {}})
        if(cart.products.productID !== req.body.ItemToBeDeleted ){
            return res.send({msg: "product does not exist"})
        }

      const updated = await cartModel.findOneAndUpdate(
        { belongsTo: req.user._id },
        {
          $pull: {
            products: { productID: req.body.ItemToBeDeleted },
          },
        }
      );
      res.send({ msg: "Item deleted from the cart" });
    } else {
      res.send({ msg: "cart does not exist" });
    }
  } catch (err) {
    throw err;
  }
};
// module.exports.orderProduct = async(req, res)=>{
//     const products = await productModel.find({_id: req.body.productID});
//     const cart = await cartModel.findById({belongsTo: req.user._id});
//     const product = products[0];
//     const Quantity=req.body.quantity;
//     const OrderTotal = product.Price * (Quantity);
//     const currUser= req.user;
//     console.log(product);
//     const newOrderDetails = {
//         ProductID: product._id,
//         UserID: currUser._id,
//         ProductName: product.ProductName,
//         PricePerUnit:product.price,
//         Quantity: Quantity,
//         OrderTotal: OrderTotal,
//         Address: req.body.orderAddress,
//       };
      
//       try {
//         const newOrder = new orderModel(newOrderDetails);
//         await newOrder.save();
//         const updated = await cartModel.findOneAndUpdate(
//             { belongsTo: req.user._id },
//             {
//               $pull: {
//                 products: { productID: product._id },
//               },
//             }
//           );
//         res.send({ msg: "Order Placed...", order: newOrder });
//       } catch (err) {
//         res.send(err);
//       }
      
// }
// const saveProduct = async (productDetails) => {
//   const newEntry = new productModel(newProduct);
//   await newEntry.save();
// };
// // saveProduct(newProduct)    ;
// const createProducts = async (req, res) => {
//   // Validation
//   const Validation = productValidation(req.body);
//   const ValidationError = Validation.error;
//   if (Validation.error)
//     return res.send({ msg: ValidationError.details[0].message });

//   //Checking if the product already exists
//   const ProductExists = await productModel.findOne({
//     ProductName: req.body.ProductName,
//   });
//   if (ProductExists)
//     return res.status(400).send({ msg: "Product Already exists" });

//   const newProduct = {
//     ProductName: req.body.ProductName,
//     ProductDescription: req.body.ProductDescription,
//     Price: req.body.Price,
//     Tags: req.body.Tags,
//     Seller: req.body.Seller,
//   };
//   try {
//     const newEntry = new productModel(newProduct);
//     await newEntry.save();
//     res.send({ msg: "New Product Registered", info: newProduct });
//   } catch (err) {
//     throw err;
//   }
// };
// const deleteProduct = async (req, res) => {
//   const ProductExists = await productModel.findOne({
//     ProductName: req.body.ProductName,
//   });
//   if (!ProductExists)
//     return res.status(400).send({ msg: "Product Does not exists" });

//   try {
//     const result = await productModel.findOne({
//       ProductName: req.body.ProductName,
//     });
//     const deleted = await productModel.findByIdAndDelete(result._id);
//     res.send({ msg: "Product successfully Deleted", deletedProduct: deleted });
//   } catch (err) {
//     console.log(err);
//   }
// };
// const getAllProducts = async (req, res) => {
//   try {
//     const products = await productModel.find();
//     res.send(products);
//   } catch (err) {
//     throw err;
//   }
// };
// const editProduct = async (req, res) => {
//   const Validation = productUpdateValidation(req.body.toUpdate);
//   const ValidationError = Validation.error;
//   if (Validation.error)
//     return res.send({ msg: ValidationError.details[0].message });

//   const ProductExists = await productModel.findOne({
//     ProductName: req.body.ProductName,
//   });
//   if (!ProductExists)
//     return res.status(400).send({ msg: "Product Does not exists" });

//   try {
//     const updated = await productModel.findByIdAndUpdate(
//       ProductExists._id,
//       req.body.toUpdate
//     );
//     res.send({ msg: "updated successfully", updatedProduct: updated });
//   } catch (err) {
//     throw err;
//     showAllOrders;
//   }
// };
// const orderProduct = async (req, res) => {
//   const currUser = req.user;
//   const productName = req.body.ProductName;
//   const product = await productModel.findOne({ ProductName: productName });
//   const newOrderDetails = {
//     ProductID: product._id,
//     UserID: currUser._id,
//     ProductName: productName,
//     Address: req.body.orderAddress,
//   };
//   try {
//     const newOrder = new orderModel(newOrderDetails);
//     await newOrder.save();
//     res.send({ msg: "Order Placed...", order: newOrder });
//   } catch (err) {
//     throw errr;
//   }

// };
// const addToCart = async (req, res) => {
//   const productID = req.body.productID;
//   const user = req.user;
//   const product = await productModel.findById(productID);
//   const addedProduct = {
//     productName: product.ProductName,
//     productID: productID,
//     price: product.Price,
//     quantity: req.body.quantity,
//   };

//   const cartExists = await cartModel.findOne({ belongsTo: user._id });
//   if (cartExists) {
//     try {

//       const updatedCart = await cartModel.updateOne(
//         { belongsTo: user._id },
//         {
//           $push: {
//             products: {
//               productName: product.ProductName,
//               productID: productID,
//               price: product.Price,
//               quantity: req.body.quantity,
//             },
//           },
//         }
//       );
//       console.log(updatedCart);
//     } catch (err) {
//       console.log(err);
//     }
//   }
//   else{
//     try{
//         const newEntry = {
//             belongsTo: user._id,
//             products: [addedProduct],
//           };
//           const newCart = new cartModel(newEntry);
//           await newCart.save();
//     }
//     catch(err){
//         console.log(err);
//     }
//   }

//   res.send({msg: "added to your shopping cart successfully"});
// };

// module.exports = {
//   createProducts,
//   deleteProduct,
//   getAllProducts,
//   editProduct,
//   orderProduct,
//   addToCart,
// };
