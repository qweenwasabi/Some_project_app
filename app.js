const express = require('express');
// var bodyParser = require('body-parser')
const app = express();
app.set('view engine', 'jade');

// app.use(bodyParser.urlencoded({extended: true}))
app.get('/', function (req, res) {
  res.render('index.jade')
})

app.get('/register', function(req, res){
  res.render('register.jade')
})

app.get('/login', function(req, res){
  res.render('login.jade')
})

app.get('/dashboard',function(req, res){
  res.render('dashboard.jade')
})

app.get('/logout',function(req, res){
  res.redirect('/')
})

app.listen(3000);
