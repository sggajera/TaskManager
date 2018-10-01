const express = require('express');
const router = express.Router();
const mongoose= require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//const passport = require('passport')

require('../models/Idea');
const Idea = mongoose.model('ideas');

//load user model
require('../models/User');
const User= mongoose.model('users')



//login route

router.get('/login',(req,res)=>{
    res.render('users/login');
})

//register route
router.get('/register',(req,res)=>{
    res.render('users/register');
})

//Login Form post
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/ideas',
        failureRedirect:'/user/login',
        failureFlash: true
    })(req,res,next);
})

//register form POST

router.post('/register',(req,res)=>{
    let errors=[];
    if(req.body.password!=req.body.password2){
        errors.push({text:'Password do not match'})
    }

    if(req.body.password.length<4){
        errors.push({text:'Password length must be at least 4'})
    }

    if(errors.length>0){
        res.render('users/register',{
            errors:errors,
            name:req.body.name,
            email:req.body.eamil,
            password:req.body.password,
            password2:req.body.password2
        });
    }
    else{
        
        User.findOne({
            email:req.body.email
        })
        .then(user=>{
            console.log(user)
                if(user){
                    console.log(user)
                    req.flash('error_msg','Email Already Registered');
                    res.redirect('/user/login');
                }

                else{
                    const newUser=new User({
                        name:req.body.name,
                        email:req.body.email,
                        password:req. body.password,
                    })
            
                    bcrypt.genSalt(10,(err,salt)=>{
                        bcrypt.hash(newUser.password,salt,(err,hash)=>{
                            if(err) throw err;
                            newUser.password=hash;
                            newUser
                                .save()
                                .then(user=>{
                                    req.flash('success_msg','register success')
                                    res.redirect('/user/login');
                                })
                                .catch(err=>{
                                    console.log(err);
                                    return;
                            });
                        });
                    });
                }
        });    
    }
});

//logout User
router.get('/logout',(req,res)=>{
    console.log()
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/user/login');
})

module.exports= router;