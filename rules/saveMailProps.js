const fs = require('fs');

function saveLastMailTime(receivedDateTime) {
    console.log(receivedDateTime);
    lastmail = JSON.stringify({
        "latestreceivedDateTime": receivedDateTime
    })
    fs.writeFile(__dirname + '/lastMail.json', lastmail, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });

}

exports.saveLastMailTime = saveLastMailTime;