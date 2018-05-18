const fs = require('fs');
const saveMailProps = require('./saveMailProps');

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
        match_count: 0
    };

    // console.log(messages[0]);

    saveMailProps.saveLastMailTime(messages[0].receivedDateTime);

    messages.forEach(message => {
        //loop over all rules and compare key params
        rules.forEach(rule => {
            //compare all keys
            if (compare_subject(message.subject, rule.subject)) {
                result.match_count++;
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