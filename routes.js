'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');
const router = express.Router();

const CHAT = path.join(__dirname, 'chat.html');

// Route for base address
router.get('/', function(req, res) {
  res.send('hello world');
});

router.get('/chat', function(req, res) {
  res.sendFile(CHAT);
});

// Route for login
router.post('/login', function(req, res) {
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
