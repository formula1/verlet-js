var Vec2 = require("./Vec2");

function AABB (){
  this.max = new Vec2(-Number.Infinity, -Number.Infinity);
  this.min = new Vec2(Number.Infinity,Number.Infinity);
}

AABB.prototype.digestPoint = function(point){
  this.max = this.max.max(point);
  this.min = this.min.min(point);
}


module.exports = AABB;
