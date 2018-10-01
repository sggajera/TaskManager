const express = require('express');
const router = express.Router();
const mongoose= require('mongoose');
const {ensureAuthentication}=require('../helpers/auth');

require('../models/Idea');
const Idea = mongoose.model('ideas');

router.get('/',(req,res)=>{
    Idea.find({user:req.user.id})
    .sort({date:'desc'})
    .then(ideas=>{
        res.render('ideas/index',{
            ideas:ideas
        })
    });
    
})

//Add ideas
router.get('/add',ensureAuthentication,(req,res)=>{
    res.render('ideas/add');
});

//Edit ideas
router.get('/edit/:id',ensureAuthentication,(req,res)=>{
    Idea.findOne({
        _id:req.params.id
    })
    .then(idea=>{
        if(idea.user!=req.user.id){
            req.flash('error_msg', 'not Authenticated')
            res.redirect('/ideas');
        }
        res.render('ideas/edit',{
            idea:idea
        });
    });

});

//Process Form
router.post('/',(req,res)=>{
   let errors=[];
   if(!req.body.title){
       errors.push({text:'please add title'});
   }

   if(!req.body.details){
       errors.push({text:'Please add details'})
   }
//View idea pages
   if(errors.length>0){
       res.render('ideas/add',{
           errors:errors,
           title:req.body.title,
           details:req.body.details
       });
   }else {
       const newUser={
           title:req.body.title,
           details:req.body.details,
           user:req.user.id
       }

    new Idea(newUser)
       .save()
       .then(idea=>{
            req.flash('success_msg','New Idea added successfully')
            res.redirect('/ideas');
       });
   }
});

//Edit form process
router.put('/:id',(req,res)=>{
    Idea.findOne({
        _id:req.params.id
    })
    .then(idea=>{
        idea.title=req.body.title;
        idea.details=req.body.details;
        idea.save()
        .then(idea=>{
            req.flash('success_msg','Video Idea Edited')
            res.redirect('/ideas');
        })
    })
});

//delete ideas
router.delete('/:id',(req,res)=>{
    Idea.remove({_id:req.params.id})
        .then(()=>{  
            req.flash('success_msg','Video Idea Removed')
            res.redirect('/ideas');
            
        });
});


module.exports = router