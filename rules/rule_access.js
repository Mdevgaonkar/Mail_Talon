const fs = require ('fs');

var ruleList;
var rules;

fs.readFile(__dirname + '/ruleList.json','utf8',function(err,data){
    if(err){
        // console.log(err);
    }else{
        //get all rules in a list
        // console.log(JSON.parse(data));
    }
});

function getAllRules(){
    //based on rule list array
    // get all rules in an array 
    ruleList.forEach(rule => {
        //add rule to rules array
    });
}




// fs.readFile('file', 'utf8', function (err, data) {
//     if (err) throw err;
//     obj = JSON.parse(data);
//   });