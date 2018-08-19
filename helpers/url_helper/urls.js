const fs = require('fs');
const last_fetch_time_fl = __dirname + '/last_fetch_time';
const lastTimestamp_Fl = __dirname + "/../LastMailTime.json";

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

  const getRecentMails = (last_fetch_time)=>{
    
    last_fetch_time = fs.readFileSync(last_fetch_time_fl, 'utf8');
    
  
    if (last_fetch_time != null) {
        return encodeURI('https://graph.microsoft.com/v1.0/me/messages?$count=true&$select=receivedDateTime,subject,isRead,from,ccRecipients,body,bodyPreview,uniqueBody,importance&$filter=receivedDateTime gt ' + last_fetch_time + '&$orderby=receivedDateTime');
    } else {
        d = new Date();
        last_fetch_time = d.toISOString(d.setHours(d.getHours() - 1 ));
        return encodeURI('https://graph.microsoft.com/v1.0/me/messages?$count=true&$select=receivedDateTime,subject,isRead,from,ccRecipients,body,bodyPreview,uniqueBody,importance&$filter=receivedDateTime gt '+last_fetch_time+'&$orderby=receivedDateTime');
    }
  }


  exports.getUnreadMailsURL = getUnreadMailsURL;
  exports.getRecentMails = getRecentMails;