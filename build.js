
var pack = require(__dirname+"/package.json");
var browserify = require("browserify");
var uglify = require("uglify-js");
var fs = require("fs");
var watch = require("node-watch");
var tester = require("./test");

if(process.env.VERLET_WATCH){
  console.log("Watching: "+__dirname+"/lib");
  build();
  watch(__dirname+"/lib", function(filename) {
    build();
  });
}else{
  build();
}

function build(){
  var b = browserify(__dirname+"/lib/dist.js", {basedir:__dirname+"/lib"});
  var writer = new fs.createWriteStream(__dirname+"/js/verlet-"+pack.version+".js");
  var bund = b .bundle();
  bund.on("error",function(e){
    console.log(e.stack);
    return;
  });
  bund.pipe(writer).on("finish",function(){
    writer.close(function(){
      try{
        var result = uglify.minify(__dirname+"/js/verlet-"+pack.version+".js");
      }catch(e){
        console.log("Uglify Error");
        console.log(e.stack);
        return;
      }
      fs.writeFileSync(__dirname+"/js/verlet-"+pack.version+".min.js");
      if(!process.env.VERLET_TEST) return;
      
      tester(function(clean){
        if(clean) console.log("done: "+Date.now());
      });
    })
  });
}
