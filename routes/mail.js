
var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth');
var graph = require('@microsoft/microsoft-graph-client');

const request = require('superagent');

/* GET /mail */
router.get('/', async function(req, res, next) {
  let parms = { title: 'Inbox', active: { inbox: true } };

  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;

  if (accessToken && userName) {
    parms.user = userName;
    var getMailsURL = encodeURI('https://graph.microsoft.com/v1.0/me/mailfolders/inbox/messages?$select=subject,from,receivedDateTime,isRead&$filter=isRead eq false&$orderby=receivedDateTime DESC');
    console.log(getMailsURL);
    
    request
   .get(getMailsURL)
   .set('Authorization', 'Bearer ' + accessToken)
   .end((err, result) => {
    //  callback(err, res);
    if(err){
      parms.message = 'Error retrieving messages';
      parms.error = { status: `${err.code}: ${err.message}` };
      parms.debug = JSON.stringify(err.body, null, 2);
      res.render('error', parms);
    }else{
        parms.messages = JSON.parse(result.text).value;
        // console.log(result);
        // console.log(parms.messages);
        // res.send(parms.messages);
        res.render('mail', parms);
    }
   });


    // Initialize Graph client
    // const client = graph.Client.init({
    //   debugLogging: true,
    //   authProvider: function (did) {
    //     did(null, accessToken);
    //   }
    // });
    // console.log(client);
    

    // try {
    //   // Get the 10 newest messages from inbox
    //   const result = await client
    //   .api('/me/mailfolders/inbox/messages?$select=subject,from,receivedDateTime,isRead&$filter=isRead eq false&$orderby=receivedDateTime DESC')
    //   .top(5)
    //   // .select('subject,from,receivedDateTime,isRead')
    //   // .filter('isRead eq false') //
    //   // .orderby('receivedDateTime DESC')
    //   .get();

    //   // console.log(result);
      

    //   parms.messages = result.value;
    //   res.render('mail', parms);
    // } catch (err) {
    //   parms.message = 'Error retrieving messages';
    //   parms.error = { status: `${err.code}: ${err.message}` };
    //   parms.debug = JSON.stringify(err.body, null, 2);
    //   res.render('error', parms);
    // }
    
  } else {
    // Redirect to home
    res.redirect('/');
  }
});

module.exports = router;