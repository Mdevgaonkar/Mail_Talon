function compare_body(message_body, rule_body) {
    if (rule_body.condition === 'equals') {
        if (message_body === rule_body.text) {
            return true;
        }
    } else if (rule_body.condition === 'includes') {
        if (message_body.includes(rule_body.text)) {
            return true;
        }
    } else if (rule_body.condition === 'match') {
        var matches = message_body.match(rule_body.text);
        if (matches) {
            return true;
        }
    } else {
        return false;
    }
}

exports.compare_body = compare_body;
exports.compare_bodyPreview = compare_body_Preview;
exports.compare_uniqueBody = compare_uniqueBody;