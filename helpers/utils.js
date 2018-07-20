function formErrorObj(err, err_msg) {
  error = {
    message: err_msg,
    status: `${err.code}: ${err.message}`
  };

  return error;
}

function formatMessage(message) {
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
  } = message;

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
  };
}

const handleResponse = (err, results, body, parms, done) => {
  //err-> if error occurs then will have some prop
  //result-> provides raw result along with request
  //body-> provide actual required info

  // console.log('statusCode:', results && results.statusCode);
  // console.log(parms);

  if (err) {
    try {
      err = JSON.parse(err);
    } catch (e) {
      console.log('Error: '+err);
      console.log(e); // error in the above string (in this case, yes)!
      parms.body = "Request Failed";
      parms.errors.push(formErrorObj(e, "Error retrieving response"));
      parms.debug.push({
        detail: `${JSON.stringify(e.body)}`
      });
      return done(parms, body);
    }

    parms.body = "Request Failed";
    parms.errors.push(formErrorObj(err, "Error retrieving response"));
    parms.debug.push({
      detail: `${JSON.stringify(err.body)}`
    });
    return done(parms, body);
  } else {
    try {
      if(typeof(body) !='object' ){
        body = JSON.parse(body);
      }
      
    } catch (e) {
      console.log(body);
      console.log(e); // error in the above string (in this case, yes)!
      parms.body = "Request Failed";
      parms.errors.push(formErrorObj(e, "Error retrieving response"));
      parms.debug.push({
        detail: `${JSON.stringify(e.body)}`
      });
      return done(parms, body);
    }
    if ("error" in body) {
      parms.body = "Request Failed";
      parms.errors.push(formErrorObj(body.error, "Error retrieving response"));
      parms.debug.push({
        detail: `${JSON.stringify(body.error.innerError)}`
      });
      return done(parms, body);
    } else {
      parms.body = "Request Succeeded";
      parms.debug.push({
        detail: "Nothing to debug ...yet"
      });
      return done(parms, body);
    }
  }
};


function formatDate(date_string) {
  const DtTime = new Date(date_string);
  let formated_DtTime =
    (DtTime.getMonth()+1) + "/" + DtTime.getDate() + "/" + DtTime.getFullYear();
  formated_DtTime =
    formated_DtTime +
    " " +
    DtTime.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "America/Havana"
    });
  return formated_DtTime;
}

exports.error = formErrorObj;
exports.formatMessage = formatMessage;
exports.handleResponse = handleResponse;
exports.formatDate = formatDate;
