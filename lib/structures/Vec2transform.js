var Vec2 = require("./Vec2");

function Transform(v){
  this.v = v;
  this.transforms = [];
}

for(var i in Vec2.prototype){
  (function(label){
    Transform.prototype[label] = function(){
      this.transforms.unshift([label, arguments])
    }
  })(i)
}

Transform.prototype.done = function(){
  var l = this.transforms.length;
  while(l--){
    this.v[this.transforms[l][0]].apply(this.v, this.transforms[l][1]);
  }
}

module.exports = Transform;
