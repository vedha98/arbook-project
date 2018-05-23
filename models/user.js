const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const config = require('../config/database');

//Schema
const UserSch = mongoose.Schema({
  name:{
    type:String
  },
  random:{
    type:String
  },
  validation:{
    type:Boolean
  },
  email:{
    type:String,
    required:true
  },
  username:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
products:[{
  name: String,
  body: String }]
})

const User = module.exports = mongoose.model('Users',UserSch);
var userMap = [];

//get all posts function
module.exports.getAllProducts = function (dd,callback) {

  User.find({}, function(err, users) {


    users.forEach(function(user) {
const aa = user.products;
      aa.forEach((us)=>{

        userMap.push(us);
      })
callback(userMap)
    });
console.log(userMap);
});
  return userMap;
};

//get user by ID
module.exports.getUserById = function (id,callback) {
  console.log(id);
  User.findById({_id:id},callback);
};

//get User by username
module.exports.getUserByUsername = function (name,callback) {
  const query = {username:name};

  User.findOne(query,callback);

};

// create new user
module.exports.addUser = function (newUser,callback) {

  bcryptjs.genSalt(10,(err,salt)=>{
    bcryptjs.hash(newUser.password,salt,(err,hash)=>{
      newUser.password=hash;
      newUser.save(callback)
    })
  })
};

// verify password
module.exports.comparePassword = function (canditatePass,hash,callback) {
bcryptjs.compare(canditatePass,hash,(err,isMatch)=>{
  if(err) throw err;
  callback(err,isMatch);
})
};
// adding posts
module.exports.Update = function (id,detail,callback) {
  var query = { random: id };

  User.findOneAndUpdate(query, {$push: {"products":{name:detail.name,
  body:detail.body}}},{safe: true, upsert: true, new: true},(err,user)=>{
  callback(err,this.User)
  } );

};

// validation
module.exports.Validate = function (user,callback) {
var query = { random:user.token};
console.log(query);
User.findOneAndUpdate(query,{"validation":true},(err,user)=>{
callback(err,this.User);
} );
return true;
};

//check user exist
module.exports.checkUserExist = function (user,callback) {
const query = {username:user.username}
console.log(user);
email = null;
urname = null;
User.find(query,(err,user)=>{
if(err) throw err;
if(user[0]){

  callback(user)

}else{
  callback(email)
}

  });





};

//no of users
module.exports.numUsers = function (details,callback) {
  var userMap = [];
var noUsers = 0;


    User.find({}, function(err, users) {

itemsprocessed = 0;
      users.forEach(function(user) {
  const aa = user.products;
        aa.forEach((us)=>{

if(us.body == details.body){noUsers+=1};
itemsprocessed++;
          userMap.push(us);

        })

if (itemsprocessed==aa.length){callback(noUsers)}
      });

  });





}
module.exports.checkEmailExist = function (user,callback) {
const query = {email:user.email}
console.log(user);
email = null;
urname = null;
User.find(query,(err,user)=>{
if(err) throw err;
if(user[0]){

  callback(user)

}else{
  callback(email)
}

  });





};
