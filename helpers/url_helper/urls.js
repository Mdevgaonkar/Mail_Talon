const last_fetch_time_fl = __dirname + '/last_fetch_time';

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
    
  
    if (latestreceivedDateTime != null) {
        return encodeURI('https://graph.microsoft.com/v1.0/me/messages?$count=true&$select=receivedDateTime,subject,isRead,from,ccRecipients,body,bodyPreview,uniqueBody,importance&$filter=isRead eq false and receivedDateTime gt ' + latestreceivedDateTime + '&$orderby=receivedDateTime');
    } else {
        return encodeURI('https://graph.microsoft.com/v1.0/me/messages?$count=true&$select=receivedDateTime,subject,isRead,from,ccRecipients,body,bodyPreview,uniqueBody,importance&$filter=isRead eq false&$orderby=receivedDateTime');
    }
  }