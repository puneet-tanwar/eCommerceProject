const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://127.0.0.1:27017/eCommerce")
  .then(() => {
    console.log("wishlist connected");
  })
  .catch((err) => {
    console.log(err);
  });
const wishlistSchema = new mongoose.Schema(
  {
    belongsTo: {
      // unique: true,
      type: String,
      required: true,
    },
    products:[
      {
        productName: {
            // unique: true,
            type: String,
            required: true,
          },
        
        productID: String,
        price: Number,
        
      }
    ]
  },
  { timestamps: true }
);

const wishlistModel = mongoose.model("wishlist", wishlistSchema);
module.exports = wishlistModel;
