const request = require("request");

const pi_exporter = require("./pi_exporter.js");
const pi_rule = require("./pi_rule.json");


const body_compare = require("../comparers/body_compare.js");
const from_compare = require("../comparers/from_compare.js");

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
  messages.map(message => {
    let sender = message.from.emailAddress.address;
    let from = from_compare.compare_senders(sender, pi_rule.from) >= 0 ? true : false;
    let body = body_compare.compare_body(message.uniqueBody.content, pi_rule.body);
    if (from && body) {
      console.log('found a taken care message');
      logPI(message);
    }
  });
}


function logPI(message) {
  let PI_row = pi_exporter.getPIRow(message);
  //   parms.body.PI_rows.push(PI_row);
  console.log(PI_row);
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

  compare_PI_rule(messages);
}

exports.log_process = log_process;