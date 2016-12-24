'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var router = express.Router();

// Route for base address
router.get('/', function(req, res) {
  res.send('hello world');
})

// Route for login
router.post('/login', function(req, res) {
  //res.send('welcome to log in ' + req.query.user + ' with password ' + req.query.pass);

  var url = 'https://authserver.mojang.com/authenticate';
  var postData = {
    "agent": {
        "name": "Minecraft",
        "version": 1.11
    },
    "username": req.query.user,
    "password": req.query.pass,
    "requestUser": true
  };
  var options = {
    method: 'post',
    body: postData,
    json: true,
    url: url
  };
  // Send request
  request(options, function(err, response, body) {
    console.log('requesting');
    if (err) {
      inspect(err, 'error posting json');
      return;
    }
    console.log(body);
    res.send(body);
  });
});

module.exports = router;
