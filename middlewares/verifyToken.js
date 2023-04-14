const jwt= require('jsonwebtoken');
const dotenv = require("dotenv")
dotenv.config();

module.exports= function (req,res,next){
    const token = req.header('auth-token');
    if(!token) return res.status(401).send({msg: "Access Denied"});
    try{
        const verified = jwt.verify(token, process.env.USER_TOKEN_SECRET);
        req.user= verified;
        // console.log(verified);
        next();
    }catch(err){
        res.status(400).send({msg: "Invalid Token"});
    }
}
