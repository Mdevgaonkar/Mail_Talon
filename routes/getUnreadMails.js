var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth');

const request = require('request');
const rule_access = require('../rules/rule_access');
const fs = require('fs');



/* GET /getUnreadMails */
router.get('/', async function (req, res, next) {
    let parms = {
        module: 'getUnreadMails',
        auth: false
    };

    const accessToken = await authHelper.getAccessToken(req.cookies, res);

    if (accessToken) {
        // parms.user = userName;
        parms.auth = true;
        var getMailsURL = getUnreadMailsURL();
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
                    parms = sendError(parms, err);
                } else {
                    parms.body = formatBody(JSON.parse(body));
                }
                res.send(parms);
            });

    } else {
        // Redirect to home
        res.redirect('/');
    }
});

module.exports = router;

const getUnreadMailsURL = () => {
    var lastMailTime;
    fs.readFile(__dirname + '/../rules/lastmail.json', 'utf8', (err, data) => {
        if (err) throw err;
        lastMailTime = data;
    });
    if (lastMailTime != null) {
        return encodeURI('https://graph.microsoft.com/v1.0/me/messages?$count=true&$select=receivedDateTime,subject,isRead,from,ccRecipients,body,bodyPreview,uniqueBody,importance&$filter=isRead eq false and receivedDateTime gt ' + lastMailTime.latestreceivedDateTime + '&$orderby=receivedDateTime DESC');
    } else {
        return encodeURI('https://graph.microsoft.com/v1.0/me/messages?$count=true&$select=receivedDateTime,subject,isRead,from,ccRecipients,body,bodyPreview,uniqueBody,importance&$filter=isRead eq false&$orderby=receivedDateTime DESC');
    }
}

const Error = (parms, err) => {
    parms.message = 'Error retrieving messages';
    parms.error = {
        status: `${err.code}: ${err.message}`
    };
    parms.debug = JSON.stringify(err.body, null, 2);
    return parms

}

var responseBodyModel = {
    count: 0,
    messages: []
}

const formatMessage = (message) => {
    var {
        receivedDateTime,
        subject,
        isRead,
        from,
        ccRecipients,
        body,
        bodyPreview,
        uniqueBody,
        importance

    } = message

    return {
        receivedDateTime: receivedDateTime,
        subject: subject,
        isRead: isRead,
        from: from,
        ccRecipients: ccRecipients,
        body: body,
        bodyPreview: bodyPreview,
        uniqueBody: uniqueBody,
        importance: importance
    }
}

const formatBody = (body) => {
    const count = body["@odata.count"];
    responseBodyModel.count = count;
    responseBodyModel.messages = body.value.map((message) => {
        return formatedMessage = formatMessage(message);

    })
    return responseBodyModel;
}