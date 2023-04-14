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
const orderSchema = new mongoose.Schema(
  {
    ProductID: {
      type: String,
      required: true,
    },
    //price, tags, providedby
    UserID: {
      type: String,
      required: true,
      min: 6,
    },
    ProductName:{
        type: String,
        required: true
    },
    Quantity:{
        type: Number,
        default: 1
    },
    PricePerUnit:{
        type: Number,
        
    },
    OrderTotal:{
        type: Number,
        
    },
    Address: {
      type: String,
      required: true,
    },
    Status:{
        type: String,
        required: true,
        default: "Pending"
    }
  },
  { timestamps: true }
);

const orderModel = mongoose.model("orders", orderSchema);
module.exports = orderModel;
