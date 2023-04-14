const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://127.0.0.1:27017/eCommerce")
  .then(() => {
    console.log("cart connected");
  })
  .catch((err) => {
    console.log(err);
  });
const cartSchema = new mongoose.Schema(
  {
    belongsTo: {
      unique: true,
      type: String,
      required: true,
    },
    products:[
      {
        productName: String,
        productID: String,
        price: Number,
        quantity: Number
      }
    ]
  },
  { timestamps: true }
);

const cartModel = mongoose.model("cart", cartSchema);
module.exports = cartModel;
