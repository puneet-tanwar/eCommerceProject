const mongoose = require("mongoose");
const productModel = require("../schema/productSchema");
const orderModel = require("../schema/orderSchema");
const cartModel = require("../schema/cartSchema");
const wishListModel = require("../schema/wishListSchema");
const {
  productValidation,
  productUpdateValidation,
} = require("../Validation/productValidation");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const { findByIdAndUpdate, findById } = require("../schema/userSchema");

dotenv.config();

mongoose
  .connect("mongodb://127.0.0.1:27017/eCommerce")
  .then(() => {
    console.log("products connected");
  })
  .catch((err) => {
    console.log(err);
  });

const newProduct = {
  ProductName: "SmartPhone",
  ProductDescription: "It is a phone",
  Price: 999,
  Tags: ["Phone", "tech"],
  Seller: "puneetInfoTech",
};

{
  const saveProduct = async (productDetails) => {
    const newEntry = new productModel(newProduct);
    await newEntry.save();
  };
  // saveProduct(newProduct)    ;
}
const createProducts = async (req, res) => {
  // Validation
  const Validation = productValidation(req.body);
  const ValidationError = Validation.error;
  if (Validation.error)
    return res.send({ msg: ValidationError.details[0].message });

  //Checking if the product already exists
  const ProductExists = await productModel.findOne({
    ProductName: req.body.ProductName,
  });
  if (ProductExists)
    return res.status(400).send({ msg: "Product Already exists" });

  const newProduct = {
    ProductName: req.body.ProductName,
    ProductDescription: req.body.ProductDescription,
    Price: req.body.Price,
    Tags: req.body.Tags,
    Seller: req.body.Seller,
  };
  try {
    const newEntry = new productModel(newProduct);
    await newEntry.save();
    res.send({ msg: "New Product Registered", info: newProduct });
  } catch (err) {
    throw err;
  }
};
const createMultipleProducts = async (req, res) => {
  const products = req.body.productsArr;
  try {
    productModel
      .insertMany(products)
      .then(() => {
        res.send({ msg: "Data inserted" });
      })
      .catch((err) => {
        res.send(err);
      });
  } catch (err) {
    console.log(err);
  }
};
const deleteProduct = async (req, res) => {
  const ProductExists = await productModel.findOne({
    ProductName: req.body.ProductName,
  });
  if (!ProductExists)
    return res.status(400).send({ msg: "Product Does not exists" });

  try {
    const result = await productModel.findOne({
      ProductName: req.body.ProductName,
    });
    const deleted = await productModel.findByIdAndDelete(result._id);
    res.send({ msg: "Product successfully Deleted", deletedProduct: deleted });
  } catch (err) {
    console.log(err);
  }
};
const getAllProducts = async (req, res) => {
  const tags = req.body.tags;
  try {
    // const products = await productModel.find({
    //     Tags:{
    //         $all:tags
    //     }
    // }).sort({Price: req.body.sort});
    const products = await productModel.find();
    // res.send({msg: "got all products", products: products})
    res.send(products);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
const editProduct = async (req, res) => {
  const Validation = productUpdateValidation(req.body.toUpdate);
  const ValidationError = Validation.error;
  if (Validation.error)
    return res.send({ msg: ValidationError.details[0].message });

  const ProductExists = await productModel.findOne({
    ProductName: req.body.ProductName,
  });
  if (!ProductExists)
    return res.status(400).send({ msg: "Product Does not exists" });

  try {
    const updated = await productModel.findByIdAndUpdate(
      ProductExists._id,
      req.body.toUpdate
    );
    res.send({ msg: "updated successfully", updatedProduct: updated });
  } catch (err) {
    throw err;
    showAllOrders;
  }
};
const orderProduct = async (req, res) => {
  const currUser = req.user;
  const productID = req.body.productID;
  const product = await productModel.findOne({ _id: productID });
  const PricePerUnit = product.Price;
  const Quantity = req.body.quantity ? req.body.quantity : 1;
  const OrderTotal = req.body.quantity
    ? parseInt(req.body.quantity) * product.Price
    : product.Price;
  const newOrderDetails = {
    ProductID: product._id,
    UserID: currUser._id,
    ProductName: product.ProductName,
    PricePerUnit: PricePerUnit,
    Quantity: Quantity,
    OrderTotal: OrderTotal,
    Address: req.body.orderAddress,
  };
  console.log(newOrderDetails);
  try {
    const newOrder = new orderModel(newOrderDetails);
    await newOrder.save();
    res.send({ msg: "Order Placed...", order: newOrder });
  } catch (err) {
    throw err;
  }
};

const incrementQuantity = async (usersCart, productID) => {
  console.log(usersCart);
  const existingProductIndex = usersCart.products.findIndex(
    (product) => product.productID === productID
  );

  usersCart.products[existingProductIndex].quantity += 1;

  const updatedCart = await usersCart.save();

  return true;
};

const addToCart = async (req, res) => {
  const productID = req.body.productID;
  const user = req.user;
  const product = await productModel.findById(productID);
  const addedProduct = {
    productName: product.ProductName,
    productID: productID,
    price: product.Price,
    quantity: req.body.quantity,
  };

  const cartExists = await cartModel.findOne({ belongsTo: user._id });
  if (cartExists) {
    try {
      const productExists = await cartModel.findOne({
        "products.productID": productID,
      });
      // if (productExists) {
      //   console.log("product already exists");
      //   if (incrementQuantity(cartExists, productID)) {
      //     return;
      //   }
      // }

      const updatedCart = await cartModel.updateOne(
        { belongsTo: user._id },
        {
          $push: {
            products: {
              productName: product.ProductName,
              productID: productID,
              price: product.Price,
              quantity: req.body.quantity,
            },
          },
        }
      );
      // console.log(updatedCart);
    } catch (err) {
      console.log(err);
    }
  } else {
    try {
      const newEntry = {
        belongsTo: user._id,
        products: [addedProduct],
      };
      const newCart = new cartModel(newEntry);
      await newCart.save();
    } catch (err) {
      console.log(err);
    }
  }

  res.send({ msg: "added to your shopping cart successfully" });
};
const wishListData = {
  belongsTo: "63feeac41bb502c102e93934",
  products: [
    {
      productName: "laptop",
      productID: "64017bb269c94f7c9d1d7c7d",
      price: 99,
    },
  ],
};
const pushToWishList = async (userID, product) => {
  // <<==== this is a function

  const list = await wishListModel.findOne({ belongsTo: userID });

  if (!list) {
    const wishListData = {
      belongsTo: userID,
      products: [product],
    };
    const newList = new wishListModel(wishListData);
    await newList.save();
  } else {
    console.log(product);
    const producPresent = await wishListModel.findOne({
      belongsTo: userID,
      productID: product,
    });
    console.log(producPresent);
    if (!producPresent) {
      const updatedList = await wishListModel.updateOne(
        { belongsTo: userID },
        {
          $addToSet: {
            products: product,
          },
        }
      );
    }
  }
};
const pullFromWishList = async (userID, productID) => {
  // <<==== this is a function

  const deleted = await wishListModel.updateOne(
    { belongsTo: userID },
    {
      $pull: {
        products: {
          productID: productID,
        },
      },
    }
  );
  console.log(deleted);
};

const addProductToWishList = async (req, res) => {
  const userID = req.user._id;
  const product = {
    productName: req.body.productName,
    productID: req.body.productID,
    price: req.body.price,
  };
  try {
    await pushToWishList(userID, product);
    res.send({ msg: "Added to wishlist" });
  } catch (error) {
    res.status(400).send(error);
  }
};

const removeProductFromWishList = async (req, res) => {
  const userID = req.user._id;
  try {
    await pullFromWishList(userID, req.body.productID);
    res.send({ msg: "Removed from wishlist" });
  } catch (error) {
    console.log(error);
  }
};

const getRelatedProducts = async (req, res) => {
  const productID = req.body.productID;
  const product = await productModel.findById(productID);
  const tags = product.Tags;
  const relatedProducts = await productModel.find({
    Tags: {
      $in: [...tags],
    },
  });
  try {
    res.json(relatedProducts);
  } catch (error) {
    res.send(error);
  }
};
const findProductByTag = async (req, res) => {
  const tagName = req.body.tag;
  const relatedProducts = await productModel.find({
    Tags: {
      $in: [tagName],
    },
  });
  try {
    res.json(relatedProducts);
  } catch (error) {
    res.send(error);
  }
};
const addTag = async (req, res) => {
  try {
    const updated = await productModel.updateOne(
      { _id: req.body.productID },
      { $push: { Tags: req.body.tag } }
    );

    res.json(updated);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
module.exports = {
  createProducts,
  deleteProduct,
  getAllProducts,
  editProduct,
  orderProduct,
  addToCart,
  createMultipleProducts,
  // toggleWishList,
  addProductToWishList,
  removeProductFromWishList,
  getRelatedProducts,
  findProductByTag,
  addTag,
};
