const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://127.0.0.1:27017/eCommerce")
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });
const productSchema = new mongoose.Schema(
  {
    ProductName: {
      unique: true,
      type: String,
      required: true,
    },
    //price, tags, providedby
    ProductDescription: {
      type: String,
      required: true,
      min: 6,
    },
    Price: {
      type: Number,
      required: true,
    },
    Tags: {
      type: Array,
    },
    Seller: {
      type: String,
    },
  },
  { timestamps: true }
);

const productModel = mongoose.model("products", productSchema);
module.exports = productModel;
