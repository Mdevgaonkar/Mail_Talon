var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth');
var getMails = require('../helpers/mail/getMails');
var getMailsUrl = require('../helpers/url_helper/urls');

const request = require('request');
const rule_access = require('../rules/rule_access');
const fs = require('fs');

/* post /compare */
router.get('/', async (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  let parms = {
    module: 'run_comparator',
    auth: false,
    errors: [],
    debug: []
  };

  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  if (accessToken) {
      parms.auth = true;
      const recent10Mails = await getMails(accessToken,getMailsUrl());
      console.log(recent10Mails.body.length);
      if(typeof recent10Mails.body==='object' && recent10Mails.body.length>0){
        rule_access.applyRules()
      }
      



  }else{
    // Redirect to home
    res.redirect('/');
  }
});

module.exports = router;