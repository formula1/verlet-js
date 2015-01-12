var fs = require("fs");
var child_process = require("child_process");
var async = require("async");
global.__lib = __dirname+"/lib";

function runTest(cb){
  var categories = fs.readdirSync("./tests");

  console.title = function(title){
    console.log("============================\n");
    console.log(title);
    console.log("\n============================");
  }
  var clean = true;
  async.eachSeries(
    fs.readdirSync("./tests"),
    function(cat,next){
      console.title("Category: "+cat);
      async.eachSeries(
        fs.readdirSync("./tests/"+cat),
        function(file,next){
          console.title(cat+".File: "+file);
          var ch = child_process.fork("./tests/"+cat+"/"+file);
          ch.on("exit",function(e){
            next();
          });
        },function(){
          next();
        }
      )
    },function(){
      cb(clean);
    }
  );
}

if(module.parent) {
  module.exports = runTest;
}else{
  runTest();
}
