var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth');

const request = require('request');
const rule_access = require('../rules/rule_access');
const fs = require('fs');

/* post /compare */
router.post('/', (req, res, next) => {
  console.log(req.headers["content-type"]);

  if (req.headers["content-type"] === 'application/json') {
    res.send(req.body);
  } else {

  }


});

module.exports = router;