function compare_subject(message_subject, rule_subject) {
    if (rule_subject.condition === "equals") {
        if (message_subject === rule_subject.text) {
            return true;
        }
    } else if (rule_subject.condition === "includes") {
        if (message_subject.includes(rule_subject.text)) {
            return true;
        }
    } else if (rule_subject.condition === "match") {
        var matches = message_subject.match(rule_subject.text);
        if (matches) {
            return true;
        }
    } else {
        return false;
    }
}

exports.compare = compare_subject;