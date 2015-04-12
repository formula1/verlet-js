
var pack = require(__dirname+"/package.json");
var browserify = require("browserify");
var uglify = require("uglify-js");
var fs = require("fs");
var watch = require("node-watch");
var tester = require("./test");
var async = require("async");

console.log("Watching: "+__dirname+"/lib");

var tasks = [];
if(process.env.VERLET_TEST){
  tasks.push(function(next){
    tester(function(e,clean){
      if(e) return next(e);
      if(!clean) return next(new Error("not clean"));
      console.log("done: "+Date.now());
      next();
    });
  });
}

tasks.push(build);

if(process.env.VERLET_WATCH){
  watch(__dirname+"/lib", function(filename) {
    run();
  });
  process.stdin.on("data", function(data){
    if(data.toString() != "\n") return;
    run();
  });
}

var running = false;
function run(){
  if(running) return;
  running = true;
  async.series(tasks,function(e){
    if(e) console.error(e);
    running = false;
  });
}

run();

function build(next){
  var b = browserify(__dirname+"/lib/dist.js", {basedir:__dirname+"/lib"});
  var writer = new fs.createWriteStream(__dirname+"/js/verlet-"+pack.version+".js");
  var bund = b.bundle();
  bund.on("error",function(e){
    console.log("Bundle Error");
    next(e);
    return;
  });
  bund.pipe(writer).on("finish",function(){
    writer.close(function(){
      var result;
      try{
        result = uglify.minify(__dirname+"/js/verlet-"+pack.version+".js");
      }catch(e){
        console.log("Uglify Error");
        return next(e);
      }
      fs.writeFile(
        __dirname+"/js/verlet-"+pack.version+".min.js",
        result.code,
        next
      );
    });
  });
}
