const fs = require ('fs');

fs.readFile(__dirname + '/ruleList.json','utf8',function(err,data){
    if(err){
        // console.log(err);
    }else{
        // console.log(JSON.parse(data));
    }
});


// fs.readFile('file', 'utf8', function (err, data) {
//     if (err) throw err;
//     obj = JSON.parse(data);
//   });