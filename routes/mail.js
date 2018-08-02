const request = require('request');
const express = require('express');
const router = express.Router();
const utils = require('../helpers/utils');
const authHelper = require('../helpers/auth');
const savedMailProps = require('../helpers/lastMailProps');
const fs = require('fs');
const lastTimestamp_Fl = __dirname + '/../rules/LastMailTime.json';
const getUnreadMails = require('../helpers/mail/getMails');


/* GET /mail */
router.get('/', async function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
    let parms = {
        module: 'getUnreadMails_module',
        auth: false,
        errors: [],
        debug: []
    };

    const accessToken = await authHelper.getAccessToken(req.cookies, res);
    if (accessToken) {
        // parms.user = userName;
        parms.auth = true;
        var getMailsURL = getUnreadMailsURL(req.cookies.lastChecked);

        try {
          const unreadMails = await getUnreadMails(accessToken,getMailsURL);
          parms.body = unreadMails.body;  
        } catch (error) {
          parms.errors.push(utils.error(error,'getUnreadMails_rejectedPromise'));
          console.log(error);
        }
        
        res.send(parms);

  } else {
    // Redirect to home
    res.redirect('/');
  }
});

const getUnreadMailsURL = (latestreceivedDateTime) => {

  // if (latestreceivedDateTime == null || latestreceivedDateTime == undefined) {
  latestreceivedDateTime = fs.readFileSync(lastTimestamp_Fl, 'utf8');
  // }

  if (latestreceivedDateTime != null) {
      return encodeURI('https://graph.microsoft.com/v1.0/me/messages?$count=true&$select=receivedDateTime,subject,isRead,from,ccRecipients,body,bodyPreview,uniqueBody,importance&$filter=isRead eq false and receivedDateTime gt ' + latestreceivedDateTime + '&$orderby=receivedDateTime');
  } else {
      return encodeURI('https://graph.microsoft.com/v1.0/me/messages?$count=true&$select=receivedDateTime,subject,isRead,from,ccRecipients,body,bodyPreview,uniqueBody,importance&$filter=isRead eq false&$orderby=receivedDateTime');
  }
}

module.exports = router;