const express = require("express");
const app = express();
const cors=require('cors');
const cookieParser = require('cookie-parser');

const userRoutes=require('./routes/userRoutes');
const productRoute=require('./routes/productRoute');
const adminRoutes=require('./routes/adminRoutes');
const cartRoutes=require('./routes/cartRoutes');

app.use(express.urlencoded({ extended: false }));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cors());
app.use(cookieParser());

app.use("/users", userRoutes);
app.use("/products", productRoute);
app.use("/admin",adminRoutes);
app.use("/cart",cartRoutes);

app.listen(5000, (req,res)=>{
    console.log("Server listening on localhost:5000");
})