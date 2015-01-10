
var pack = require(__dirname+"/package.json");
var browserify = require("browserify");
var uglify = require("uglify-js");
var fs = require("fs");
var watch = require("node-watch");

if(process.env.WATCH){
  console.log("Watching: "+__dirname+"/lib");
  watch(__dirname+"/lib", function(filename) {
    build();
  });
}else{
  build();
}

function build(){
  try{
    var b = browserify(__dirname+"/lib/dist.js", {basedir:__dirname+"/lib"});
  }catch(e){
    console.log("Browserify Error");
    console.log(e.stack);
    return;
  }
  var writer = new fs.createWriteStream(__dirname+"/js/verlet-"+pack.version+".js");
  var bund = b .bundle();
  bund.pipe(writer).on("finish",function(){
    writer.close(function(){
      try{
        var result = uglify.minify(__dirname+"/js/verlet-"+pack.version+".js");
      }catch(e){
        console.log("Uglify Error");
        console.log(e.stack);
      }
      fs.writeFileSync(__dirname+"/js/verlet-"+pack.version+".min.js");
      console.log("done: "+Date.now());
    })
  });
}