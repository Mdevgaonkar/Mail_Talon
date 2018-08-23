const fs = require("fs");
const subject = require("../helpers/comparers/subject_compare");
const sender = require("../helpers/comparers/from_compare");
const body = require("../helpers/comparers/body_compare");

var ruleList;
var rules = [];

function getRuleList() {
  fs.readFile(__dirname + "/ruleList.json", "utf8", function(err, data) {
    if (err) {
      console.log(`Error while reading rulelist ${err}`);
      return `Error while reading rulelist ${err}`;
    } else {
      //get all rules in a list
      ruleList = JSON.parse(data);
      getAllRules();
      // console.log(JSON.parse(data));
    }
  });
}

function getAllRules() {
  //based on rule list array

  // get all rules in an array
  ruleList.forEach(rule => {
    //add rule to rules array
    fs.readFileSync(__dirname + `/${rule.filename}`, "utf8", function(
      err,
      data
    ) {
      if (err) {
        console.log(`Error while reading rule ${rule.filename} ${err}`);
        return `Error while reading rule ${rule.filename} ${err}`;
      } else {
        //get all rule content
        const rule_content = JSON.parse(data);
        rules.push(rule_content);
      }
    });
  });
}

function applyRules(messages) {
  var result = {
    mail_count: messages.length,
    match_count: 0,
    matches: []
  };
  return new Promise(resolve => {
    getRuleList();
    messages.forEach(message => {
      //loop over all rules and compare key params

      rules.forEach(rule => {
        let rule_matched = false;
        let subject_matched = false;
        let from_matched = false;
        let body_matched = false;
        //compare all keys
        if ("subject" in rule) {
          if (subject.compare(message.subject, rule.subject)) {
            subject_matched = true;
          }
        } else {
          subject_matched = true; //'subject' is ignored in the rule
        }
        if ("from" in rule) {
          if (sender.compare(message.from.emailAddress.address, rule.from)) {
            from_matched = true;
          }
        } else {
          from_matched = true; //'from' is ignored in the rule
        }
        if ("body" in rule) {
          if (body.compare(message.uniqueBody.content, rule.body)) {
            body_matched = true;
          }
        } else {
          body_matched = true; //'body' is ignored in the rule
        }

        if (subject_matched && from_matched && body_matched) {
          rule_matched = true;
          result.matches.push({
            message: message,
            rule: rule
          });
        }
      });
    //   matched ? result.match_count++ : "";
    });
    resolve(result);
  });
}
exports.applyRules = applyRules;
