const fs = require('fs');
const lastTimestamp_Fl = __dirname + '/../rules/LastMailTime.json';

function saveLastMailPropsToCookies(message, res) {

    // Save the receivedDateTime + 1s in a cookie
    let latestReceivedDateTime = new Date(message.receivedDateTime);
    latestReceivedDateTime.setSeconds(latestReceivedDateTime.getSeconds() + 1);
    fs.writeFileSync(lastTimestamp_Fl, latestReceivedDateTime.toISOString());
    res.cookie('lastChecked', latestReceivedDateTime.toISOString(), {
        maxAge: 3600000,
        httpOnly: true
    });

}

function clearLastMailPropsCookies(res) {
    // Clear cookies
    res.clearCookie('lastChecked', {
        maxAge: 3600000,
        httpOnly: true
    });
}


exports.saveLastMailPropsToCookies = saveLastMailPropsToCookies;
exports.clearLastMailPropsCookies = clearLastMailPropsCookies;