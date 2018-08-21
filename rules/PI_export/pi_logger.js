const request = require("request");

const pi_exporter = require("./pi_exporter.js");
const pi_rule = require("./pi_rule.json");
const utils = require("../../helpers/utils");

const body_compare = require("../comparers/body_compare.js");
const from_compare = require("../comparers/from_compare.js");
const excel_utils = require("../../helpers/excel_helper");
const savedMailProps = require("../../helpers/lastMailProps");
const getMails = require("../../helpers/mail/getMails");
const fs = require("fs");
const lastTimestamp_Fl = __dirname + "/../LastMailTime.json";
// getMails();

function getMails_2(cookies) {
  return new Promise(resolve => {
    request.get(
      {
        uri: "http://localhost:5000/getUnreadMails",
        headers: {
          Cookie: cookies
        }
      },
      (err, results, body) => {
        if (err) {
          console.log(err);
        } else {
          let response_Body = JSON.parse(body);
          if ("body" in response_Body && "messages" in response_Body.body) {
            resolve({
              lastChecked: response_Body.body.lastChecked,
              count: response_Body.body.count,
              messages: response_Body.body.messages
            });
          }
        }
      }
    );
  });
}

function compare_PI_rule(messages) {
  let PI_rows = [];
  messages.map(message => {
    // console.log('from' in message);

    if ("from" in message) {
      var sender = message.from.emailAddress.address;
      var from =
        from_compare.compare_senders(sender, pi_rule.from) >= 0 ? true : false;
    } else {
      sender = "Mayur.Devgaonkar@genworth.com";
    }

    let body = body_compare.compare_body(
      message.uniqueBody.content,
      pi_rule.body
    );
    if (from && body) {
      PI_row = logPI(message);
      PI_rows.push([
        PI_row.issue_resolver,
        PI_row.issue_aplication,
        PI_row.issue_blank_col1,
        PI_row.issue_blank_col2,
        PI_row.issue_subject,
        PI_row.issue_dateTime,
        PI_row.issue_body,
        PI_row.issue_rootCause,
        PI_row.issue_resolution,
        PI_row.issue_recDate,
        PI_row.issue_respDate,
        PI_row.issue_resolvedDate
      ]);
    }
  });
  console.log(`found ${PI_rows.length} taken care message/s`);
  return PI_rows;
}

function logPI(message) {
  let PI_row = pi_exporter.getPIRow(message);
  //   parms.body.PI_rows.push(PI_row);
  console.log(PI_row);
  return PI_row;
}

const getUnreadMailsURL = latestreceivedDateTime => {
  // if (latestreceivedDateTime == null || latestreceivedDateTime == undefined) {
  latestreceivedDateTime = fs.readFileSync(lastTimestamp_Fl, "utf8");
  // }

  if (latestreceivedDateTime != null) {
    return encodeURI(
      "https://graph.microsoft.com/v1.0/me/messages?$count=true&$select=receivedDateTime,subject,isRead,from,ccRecipients,body,bodyPreview,uniqueBody,importance&$filter=isRead eq false and receivedDateTime gt " +
        latestreceivedDateTime +
        "&$orderby=receivedDateTime"
    );
  } else {
    return encodeURI(
      "https://graph.microsoft.com/v1.0/me/messages?$count=true&$select=receivedDateTime,subject,isRead,from,ccRecipients,body,bodyPreview,uniqueBody,importance&$filter=isRead eq false&$orderby=receivedDateTime"
    );
  }
};

async function log_process(req, res) {
  console.log("Getting new mails");
  var getMailsURL = getUnreadMailsURL(req.cookies.lastChecked);
  let mails = await getMails(req.cookies.graph_access_token, getMailsURL);
  let lastChecked =
    mails.body.lastChecked == null
      ? req.cookies.lastChecked
      : mails.body.lastChecked;
  let count = mails.body.messages.length;
  let messages = mails.body.messages;
  console.log(utils.formatDate(lastChecked));
  console.log(count);

  if (count > 0) {
    console.log(" Searching for PIs");

    var PI_rows = compare_PI_rule(messages);

    var loggedPI_rows =
      PI_rows.length > 0
        ? await excel_utils.log_PI_to_excel(req, PI_rows)
          ? 1
          : 0
        : -1;
    savedMailProps.saveLastMailPropsToCookies(lastChecked, res);
  }

  // return loggedPI_rows;
  return {
    log_status: loggedPI_rows == 0 ? false : true,
    message:
      loggedPI_rows == -1
        ? "NO new Prod issue found"
        : loggedPI_rows == 0
          ? "Failed"
          : "Prod issue found and logged",
    lastChecked: loggedPI_rows == 1 ? lastChecked : req.cookies.lastChecked
  };
}

exports.log_process = log_process;
