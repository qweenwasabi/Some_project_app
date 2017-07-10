const express = require('express');
const csrf = require('csurf');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const sessions = require('client-sessions');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/newauth1')

const User = mongoose.model('User', new Schema({
  id:ObjectId,
  firstName: String,
  lastName: String,
  email: {type: String, unique: true},
  password: String,
}))

const app = express();

app.set('view engine', 'pug');



app.use(bodyParser.urlencoded({extended: true}))


app.use(sessions({
  cookieName: 'session',
  secret:'ekdkelsoirhdyesgahsaheydswsldwmcx',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

app.use(csrf());

app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    User.findOne({ email: req.session.user.email }, function(err, user) {
      if (user) {
        req.user = user;
        delete req.user.password;
        req.session.user = user;
        res.locals.user = user;
      }
      next();
    })
  } else {
    next();
  }
})

function requireLogin(req, res, next) {
  if(!req.user) {
    res.redirect('/login');
  } else {
    next();
  }
}

app.get('/', function (req, res) {
  res.render('index.pug')
});

app.get('/register', function(req, res){
  res.render('register.pug', {csrfToken: req.csrfToken() });
});

app.post('/register', function(req, res){
  let hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  console.log(req.body)
  let user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hash,

  })
  user.save(function(err){
    if(err){
      console.log(err);
      err = "Something went wrong, try again!";
      if(err.code === 11000) {
        err = "That email is already taken";
      }
      res.render('register.pug', {error:err});
    }else{
      res.redirect('/dashboard');
    }
  })
})

app.get('/login', function(req, res){
  res.render('login.pug', { csrfToken: req.csrfToken() });
});
app.post('/login', function(req, res){
  User.findOne({ email: req.body.email}, function(err, user){
    if(!user) {
      res.render('login.pug', { error: 'Invalid email or password.'});
    } else {
      if(bcrypt.compareSync(req.body.password, user.password)) {
      req.session.user = user;
        res.redirect('/dashboard');
      } else {
       res.render('login.pug', { error: 'Invalid email or password.'});
      }
    }
  });
});

app.get('/dashboard', requireLogin, function(req, res){
  res.render('dashboard.pug')
});

app.get('/logout',function(req, res){
  req.session.reset();
  res.redirect('/')
});

app.listen(3000);
