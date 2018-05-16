var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth');

const request = require('request');
const rule_access = require('../rules/rule_access');
const lastMailTime = require('../rules/lastmail.json');

/* GET /mail */
router.get('/', async function (req, res, next) {
  let parms = {
    module: 'comparator',
  };

  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;

  if (accessToken && userName) {
    parms.user = userName;
    var getMailsURL = encodeURI('https://graph.microsoft.com/v1.0/me/mailfolders/inbox/messages?$select=subject,from,receivedDateTime,isRead&$filter=isRead eq false and receivedDateTime gt ' + lastMailTime.latestreceivedDateTime + '&$orderby=receivedDateTime DESC');
    // console.log(getMailsURL);

    request
      .get({
        uri: getMailsURL, // proxy:'http://proxy.server.com', 
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      }, (err, results, body) => {
        //err-> if error occurs then will have some prop
        //result-> provides raw result along with request
        //body-> provide actual required info
        console.log('statusCode:', results && results.statusCode);
        // console.log('Body:', body);
        if (err) {
          parms.message = 'Error retrieving messages';
          parms.error = {
            status: `${err.code}: ${err.message}`
          };
          parms.debug = JSON.stringify(err.body, null, 2);
          res.send(parms);
        } else {
          // console.log('Here you go');
          // parms.result = JSON.parse(body).value;
          rule_access.applyRules(JSON.parse(body).value,(err,rule_res)=>{
          parms.result =rule_res.result;

          res.send(parms);
          });
        }
      });

  } else {
    // Redirect to home
    res.redirect('/');
  }
});

module.exports = router;