const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Product = require('../models/products');
const nodemailer = require('nodemailer');




//add product
router.post('/getproduct', passport.authenticate('jwt', {session:false}), (req, res, next) => {
Product.productexist(req.body.id,(err,callback)=>{
  if(err) throw err;

if(callback){
  return res.json({success: true, msg: 'Product found',product:{
    name:callback.name,
    id:callback.body
  }});
}else{
  return res.json({success: false, msg: 'No Products found'});
}
})


});
//get product
router.post('/addproduct', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  let newproduct = new Product({
    name:req.body.name,
    body:req.body.id
  });
Product.addproduct(newproduct,(err,product)=>{
    if(err) throw err;

})

return res.json({success: true, msg: 'Created Successfully'});
});


module.exports = router;
