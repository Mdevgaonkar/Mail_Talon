const he = require("he");

function cleanBody(body_string, newLinesAllowed) {
    const stripedHtml = body_string.replace(/<[^>]+>/g, "");
    let stripedNewLines = "";
    if (newLinesAllowed) {
        stripedNewLines = stripedHtml.replace(/[\n][\r]/g, "");
    } else {
        stripedNewLines = stripedHtml.replace(/[\r][\n]/g, "");
    }

    const decodedStripedHtml = he.decode(stripedNewLines);
    return decodedStripedHtml;
}

function compare_body(message_body, rule_body) {
    msg_body = cleanBody(message_body, false);
    if (rule_body.condition === "equals") {
        if (msg_body === rule_body.text) {
            return true;
        } else false;
    } else if (rule_body.condition === "includes") {
        if (msg_body.includes(rule_body.text)) {
            return true;
        } else false;
    } else if (rule_body.condition === "match") {
        match_exp = new RegExp(rule_body.text, "gi");
        var matches = match_exp[Symbol.match](msg_body);
        if (matches == null) {
            return false;
        }
        return matches.length > 0 ? true : false;
    } else {
        return false;
    }
}

exports.compare_body = compare_body;
exports.cleanBody = cleanBody;
// exports.compare_bodyPreview = compare_body_Preview;
// exports.compare_uniqueBody = compare_uniqueBody;