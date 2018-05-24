const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const config = require('../config/database');

//User Schema
const ProSch = mongoose.Schema({
  name:{
    type:String
  },
  body:{
    type:String
  },

})

const Product = module.exports = mongoose.model('Products',ProSch);
module.exports.productexist = function (product_id,callback){
  const query = {
    body : product_id
  };
  Product.findOne(query,callback);
}
module.exports.addproduct = function (product,callback){

  product.save(callback)
}
