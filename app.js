const express= require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app=express()
const passport = require('passport');
const port = process.env.PORT || 5000;


//load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//passport config
require('./config/passport')(passport);


//DB confog 
const db=require('./config/database')

//Map global promise- get rid of waring
mongoose.Promise=global.Promise

//static folder
app.use(express.static(path.join(__dirname,'public')));

//connect to mongoose
mongoose.connect(db.mongoURI,{
    //useMongoClient:true
    useNewUrlParser: true 
})
.then(()=>console.log('mongoDB connected'))
.catch(err=>{console.log(err)});

//load idea model
require('./models/Idea');
const Idea = mongoose.model('ideas')

//handel bar middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Method override middleware
app.use(methodOverride('_method'));

//session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//global variable
app.use(function(req,res,next){
    
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg= req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user=req.user||null;
    next();
});

//index route
app.get('/',(req,res)=>{
    const title='Welcome'
    res.render('index',{
        title:title
    });
});

app.get('/about',(req,res)=>{
    res.render('about');
});

//Idea routes
app.use('/ideas',ideas);

//user routes
app.use('/user',users);

app.listen(port, ()=>{
    console.log(`Server started in port ${port}`);
});