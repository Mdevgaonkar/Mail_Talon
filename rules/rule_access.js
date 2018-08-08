const fs = require('fs');
const subject = require('../helpers/comparers/subject_compare');
const sender = require('../helpers/comparers/from_compare');
const body = require('../helpers/comparers/body_compare');

var ruleList;
var rules = [];

fs.readFile(__dirname + '/ruleList.json', 'utf8', function (err, data) {
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

function getAllRules() {
    //based on rule list array

    // get all rules in an array 
    ruleList.forEach(rule => {
        //add rule to rules array
        fs.readFile(__dirname + `/${rule.filename}`, 'utf8', function (err, data) {
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



function applyRules(messages, done) {
    var result = {
        mail_count: 0,
        match_count: 0,
        result: []
    };


    messages.forEach(message => {
        //loop over all rules and compare key params
        rules.forEach(rule => {
            //compare all keys
            if (subject.compare(message.subject, rule.subject)) {
                
            }
            if (sender.compare(message.from.emailAddress.address, rule.from)) {
                
            }
            if (body.compare(message.uniqueBody.content, rule.subject)) {
                
            }
            

        });
        result.mail_count++;
    });
    return done(null, {
        result: result
    });
}
exports.applyRules = applyRules;


function compare_subject(message_subject, rule_subject) {
    if (rule_subject.condition === 'equals') {
        if (message_subject === rule_subject.text) {
            return true;
        }
    } else if (rule_subject.condition === 'includes') {
        if (message_subject.includes(rule_subject.text)) {
            return true;
        }
    } else if (rule_subject.condition === 'match') {
        var matches = message_subject.match(rule_subject.text);
        if (matches) {
            return true;
        }
    } else {
        return false;
    }
}