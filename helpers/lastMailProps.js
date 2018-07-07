const fs = require('fs');
const lastTimestamp_Fl = __dirname + '/../rules/LastMailTime.json';

function saveLastMailPropsToCookies(lastReceivedDateTime, res) {

    // Save the receivedDateTime + 1s in a cookie
    let latestReceivedDateTime = new Date(lastReceivedDateTime);
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