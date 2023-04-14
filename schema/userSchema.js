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
const userSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
    min: 6,
    max: 200
  },
  Email: {
    type: String,
    unique: true,
    required: true,
    min:6 
  },
  Password: {
    type: String,
    required: true,
    min: 8
  },
  Date:{
    type: Date,
    default: Date.now()
  },
  isAdmin:{
    type: Boolean,
    default: false
  }
},{timestamps: true});

const userModel = mongoose.model("users", userSchema);
module.exports=userModel;