const request = require("request");

const pi_exporter = require("./pi_exporter.js");
const pi_rule = require("./pi_rule.json");


const body_compare = require("../comparers/body_compare.js");
const from_compare = require("../comparers/from_compare.js");
const excel_utils = require("../../helpers/excel_helper");
// getMails();



function getMails(cookies) {

  return new Promise(resolve => {
    request.get({
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
  })

}

function compare_PI_rule(messages) {
  let PI_rows = [];
  messages.map(message => {
    let sender = message.from.emailAddress.address;
    let from = from_compare.compare_senders(sender, pi_rule.from) >= 0 ? true : false;
    let body = body_compare.compare_body(message.uniqueBody.content, pi_rule.body);
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
      ])
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

async function log_process(req) {
  console.log('Getting new mails');
  let {
    lastChecked,
    count,
    messages
  } = await getMails(req.headers.cookie);

  console.log(lastChecked);
  console.log(count);
  console.log(' Searching for PIs');

  let PI_rows = compare_PI_rule(messages);

  let loggedPI_rows = PI_rows.length > 0 ? excel_utils.log_PI_to_excel(req, PI_rows) : false;


}

exports.log_process = log_process;