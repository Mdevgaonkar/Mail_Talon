const request = require('request');
const express = require('express');
const router = express.Router();
const utils = require('../helpers/utils');
const authHelper = require('../helpers/auth');
const savedMailProps = require('../helpers/lastMailProps');
const fs = require('fs');
const lastTimestamp_Fl = __dirname + '/../rules/LastMailTime.json';

/* GET /getUnreadMails */
router.get('/', async function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    let parms = {
        module: 'getUnreadMails',
        auth: false,
        errors: [],
        debug: []
    };

    const accessToken = await authHelper.getAccessToken(req.cookies, res);
    if (accessToken) {
        // parms.user = userName;
        parms.auth = true;
        var getMailsURL = getUnreadMailsURL(req.cookies.lastChecked);
        request
            .get({
                uri: getMailsURL,
                proxy: process.env.proxyURL != 'null' ? process.env.proxyURL : null,
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            }, (err, results, body) => {
                utils.handleResponse(err, results, body, parms, (parms, body) => {
                    if (parms.body.indexOf('succeeded')) {
                        parms.body = formatBody(body);
                        if (typeof parms.body == 'object' && ('messages' in parms.body) && (parms.body.messages.length > 0)) {
                            let max_index = parms.body.messages.length-1;
                            parms.body.lastChecked = parms.body.messages[max_index].receivedDateTime;
                            // savedMailProps.saveLastMailPropsToCookies(parms.body.lastChecked, res);
                        }else{
                            parms.body.lastChecked = req.cookies.lastChecked;
                        }
                    }
                    res.send(parms);

                });
            })
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

var responseBodyModel = {
    count: 0,
    lastChecked: '',
    messages: []
}

const formatBody = (body) => {
    if (body != undefined && "@odata.count" in body) {
        var count = body["@odata.count"];
    } else {
        count = null;
    }
    responseBodyModel.count = count;
    responseBodyModel.messages = body.value.map((message) => {
        return formatedMessage = utils.formatMessage(message);
    });
    return responseBodyModel;
}



module.exports = router;