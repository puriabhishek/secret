require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")

const app = express();

console.log(process.env.API_KEY);

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

const secret = process.env.SECRET;
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
userSchema.plugin(encrypt, { secret: secret,encryptedFields: ['password'] });
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});
const USER = mongoose.model('User', userSchema);
app.get('/',(req,res)=>{
  res.render("home");
});
app.get('/login',(req,res)=>{
  res.render("login");
});
app.get('/register',(req,res)=>{
  res.render("register");
});

app.post("/register",(req,res)=>{
  const newUser = new USER({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(!err){
      res.render("secrets")
    }
    else{
      console.log(err);
    }
  });
});

app.post("/login",(req,res)=>{
  const username = req.body.username;
  const password = req.body.password;
  USER.findOne({email:username},function(err,foundUser){
    if(!err){
      if(foundUser){
        if(foundUser.password===password){
          res.render("secrets")
        }
      }
    }
    else{
      console.log(err);
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});