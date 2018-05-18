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


const handleResponse = (err, results, body, parms, done) => {
    //err-> if error occurs then will have some prop
    //result-> provides raw result along with request
    //body-> provide actual required info
    try {
        err = JSON.parse(err);
        body = JSON.parse(body);
    } catch (e) {
        console.log(e); // error in the above string (in this case, yes)!
    }

    console.log('statusCode:', results && results.statusCode);
    console.log(parms);

    if (err) {
        parms.body = 'Request Failed';
        parms.errors.push(formErrorObj(err, 'Error retrieving messages'));
        parms.debug.push({
            detail: `${JSON.stringify(err.body)}`
        });
        return done(parms, body);
    } else if ('error' in body) {
        parms.body = 'Request Failed';
        parms.errors.push(formErrorObj(body.error, 'Error retrieving messages'));
        parms.debug.push({
            detail: body.error.innerError
        });
        return done(parms, body);
    } else {
        parms.body = 'Request Succeeded';
        parms.debug.push({
            detail: 'Nothing to debug ...yet'
        });
        return done(parms, body);
    }
}

exports.error = formErrorObj;
exports.formatMessage = formatMessage;
exports.handleResponse = handleResponse;