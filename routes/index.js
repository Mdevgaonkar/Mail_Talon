var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth');

/* GET home page. */
router.get('/', async function(req, res, next) {
  let parms = {};

  console.log(req.cookies);
  
  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;

  if (accessToken && userName) {
    parms.user = userName;
    parms.accessToken = accessToken;
    // parms.debug = `User: ${userName}\nAccess Token: ${accessToken}`;
  } else {
    parms.signInUrl = authHelper.getAuthUrl();
    // parms.debug = parms.signInUrl;
  }

  res.setHeader('Content-Type', 'application/json');
  console.log(res.cookies);
  res.send(parms);
});

module.exports = router;
