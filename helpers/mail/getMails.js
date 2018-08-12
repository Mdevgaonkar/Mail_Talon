const request = require("request");
const utils = require("../utils");
const savedMailProps = require("../lastMailProps");

/* GET /getUnreadMails */
function getUnreadMails(accessToken, getMailsURL) {
  let parms = {
    module: "getUnreadMails",
    auth: true,
    errors: [],
    debug: []
  };
  return new Promise(resolve => {
    request.get(
      {
        uri: getMailsURL,
        proxy: process.env.proxyURL != "null" ? process.env.proxyURL : null,
        headers: {
          Authorization: "Bearer " + accessToken
        }
      },
      (err, results, body) => {
        utils.handleResponse(err, results, body, parms, (parms, body) => {
          if (parms.body.indexOf("succeeded")) {
            parms.body = formatBody(body);
          }
          resolve(parms);
        });
      }
    );
  });
}

const formatBody = body => {
  let responseBodyModel = {
    count: 0,
    lastChecked: "",
    nextLink: "",
    messages: []
  };

  if (body != undefined) {
    // set count
    "@odata.count" in body
      ? (responseBodyModel.count = body["@odata.count"])
      : (responseBodyModel.count = null);

    "@odata.nextLink" in body
      ? (responseBodyModel.nextLink = body["@odata.nextLink"])
      : (responseBodyModel.nextLink = null);

    "value" in body
      ? (responseBodyModel.messages = [...body.value])
      : utils.error({code: "api error"}, "body.value is not present");

    let num_messages = responseBodyModel.messages.length;
    num_messages > 0
      ? (responseBodyModel.lastChecked =
          responseBodyModel.messages[num_messages-1].receivedDateTime)
      : (responseBodyModel.lastChecked = null);
  }
  // parms.body.lastChecked = parms.body.messages[max_index].receivedDateTime;

  // responseBodyModel.messages = body.value.map((message) => {
  //     return formatedMessage = utils.formatMessage(message);
  // });
  return responseBodyModel;
};



module.exports = getUnreadMails;
