const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Product = require('../models/products');
const nodemailer = require('nodemailer');


//setting up nodemailer
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'vetha.gnanam98@gmail.com',
    pass: 'ellelvethAqwe123#'
  }
});



// Register
router.post('/register', (req, res, next) => {
  User.checkUserExist(req.body,(isTrue)=>{


    if (isTrue) {
        res.json({success: false, msg:'Username Aready taken'});
    }

    else {
      User.checkEmailExist(req.body,(isTrue)=>{

        if (isTrue) {
            res.json({success: false, msg:'Already an account linked with this email'});
        }
        else{

var randomNumber = Math.floor(Math.random() *200000*200000*100000);
      let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        validation: false,
        random: randomNumber
      });

      User.addUser(newUser, (err, user) => {
        if(err){
          res.json({success: false, msg:'Failed to register user'});
        } else {
          res.json({success: true, msg:'User registered'});


//mail content

      var mailOptions = {
        from: 'new gen labs',
        to: newUser.email,
        subject: 'Verification of your account',
        text: 'Click on this link to verify your account website = '+"http://localhost:8080/users/validate?token=" +user.random+'    this is required for your login'
      };

//sending mail

      transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
    }
  });
}
})
}
});
});
//get all posts

router.get('/products', (req, res, next) => {
User.getAllProducts(req,(val) => {
console.log(val);
res.send(val);
  });

})

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const username = req.body.email;
  const password = req.body.password;
  User.getUserByEmail(username, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }
    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        if(user.validation==true){
        const token = jwt.sign(user, config.secret, {
          expiresIn: 604800 // 1 week
        });
        res.json({
          success: true,
          token: 'JWT '+token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,

          }
        });
      }else {



        //mail content

              var mailOptions1 = {
                from: 'new gen labs',
                to: user.email,
                subject: 'Verification of your account',
                text: 'Click on this link to verify your account website = '+"http://localhost:8080/users/validate?token=" +user.random+'    this is required for your login'
              };

        //sending mail

              transporter.sendMail(mailOptions1, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });

console.log(user.email);
          return res.json({success: false, msg: 'Please verify your account'});
      }
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json(req.user);
});
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
// validating email
router.get('/validate', (req, res, next) => {
  User.Validate(req.query,(err,cs)=>{

 return res.redirect('http://the_website.com/')
 });
});
// Register new product
router.post('/update',passport.authenticate('jwt',{session:false}), function(req, res) {
Product.productexist(req.body.details.body,(err,callback)=>{

  if(!callback){
    return res.json({
      success: false ,
      msg: "Not a valid code"
    });
  }else{
    User.productregistered(req.body.details,req.body.id,(exist)=>{
      if(exist){
        return res.json({
          success: false ,
          msg: "Already registered in this account"
        });
      }else{
        User.numUsers(req.body.details,(num)=>{ console.log(num);

        if(num>1){
          return res.json({
            success: false ,
            msg: "Maximum number of users reached"
          });
        }else{
          User.Update(req.body.id,req.body.details,(err,msg)=>{
        if(err) throw err;
         return res.json({
           success:true,
           msg: "added successfully"
         });
        })}

          });
      }
    })
  }
})




});

router.post('/validateconnection',passport.authenticate('jwt',{session:false}),function(req,res){



  User.checkConnections(req.user,req.body.ip,(callback)=>{

    if(callback==true){
     return res.json({
        success:true,
        msg:"the device has been verified  successfully"
        });
    }else if(callback==false){
      User.checkmaxconnection(req.user,(callback)=>{
        if(callback==true){
          return res.json({
            success:false,
            msg:"maximum number of users reached"
            });
        }else if(callback == false){
          User.setnewconnection(req.user,req.body.ip,(err,callback)=>{
if(err) throw err;
  return res.json({
    success:true,
    msg:"new device verified successfully"
    });



            })
        }
        })
    }
    })







  })
  router.post('/logoutalldevices',passport.authenticate('jwt',{session:false}),function(req,res){
User.logoutalldevices(req.user,(err,callback)=>{

  })

return res.json({
  success:true,
  msg: "logged out from all devices"
});


    })


module.exports = router;
