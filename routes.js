'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  console.log('getting');
  res.send("sent a get");
});

// Function for log in
router.post('/:email:password', function(req, res) {
  res.json({
    response: 'You sent a post request',
    body: req.body
  });
});

module.exports = router;
