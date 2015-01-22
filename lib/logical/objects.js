
function inherit(target,toinherit){
  for(var i in toinherit.prototype){
    Object.defineProperty(target,i,{
      enumerable: false,
      value:toinherit.prototype[i].bind(target)
    });
  }
}

overloadedVec2 = function(){
  if(arguments.length > 2){
    throw new Error("improper number of arguments");
  }
  if(arguments.length == 0){
    return new Vec2();
  }
  if(arguments.length == 2){
    if(typeof arguments[0] != "number" || typeof arguments[1] != "number"){
      throw new Error("2 numbers are required when providing 2 arguments");
    }
  }
  if(arguments.length == 1){
    if(arguments[0] instanceof Vec2){
      return arguments[0];
    }
    if(arguments[0].pos && arguments[0].pos instanceof Vec2){
      return arguments[0].pos;
    }
    if(Array.isArray(arguments[0])){
      if(x.length != 2){
        throw new Error("Vec2 needs an array of 2 when providing an array");
      }
      return Vec2.overloaded(arguments[0][0],arguments[0][1]);
    }
    throw new Error("for one argument, a Vec2, Particle or an Array is required");
  }
}

overloadArgumentsVec2 = function(args,lengthTest,iterateTest){
  var len;
  if((len = lengthTest(args.length))){
    args = Array.prototype.slice.call(args,0);
  }else if(args.length == 1){
    if(!Array.isArray(args[0])){
      throw new Error("need either an Array or Arguments");
    }
    if(!(len = lengthTest(args[0].length))){
      throw new Error("improper number of arguments in array");
    }
    args = args[0].slice(0);
  }else{
    console.log(args.length);
    throw new Error("improper number of arguments");
  }
  for(var i=0;i<len;i++){
    if(iterateTest){
      args[i] = iterateTest(i,args);
    }
  }
  return args;
}
