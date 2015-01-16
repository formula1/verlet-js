var Vec2 = require("./Vec2");

function AABB (points){
  this.max = new Vec2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
  this.min = new Vec2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
  if(points){
    if(arguments.length > 1){
      var l = arguments.length;
      while(l--){this.digestPoint(arguments[l]);}
    }else{
      var l = points.length;
      while(l--){this.digestPoint(points[l]);}
    }
  }
}

AABB.prototype.digestPoint = function(point){
  this.max.max(point);
  this.min.min(point);
}

AABB.prototype.intersectsAABB = function(oAABB){
  if(this.min.x >= oAABB.max.x) return false;
  if(this.min.y >= oAABB.max.y) return false;
  if(oAABB.min.x >= this.max.x) return false;
  if(oAABB.min.y >= this.max.y) return false;
  return true;
}

AABB.prototype.containsPoint = function(point){
  if(point.x >= this.max.x) return false;
  if(point.y >= this.max.y) return false;
  if(point.x <= this.min.x) return false;
  if(point.y <= this.min.y) return false;
  return true;
}

AABB.prototype.intersectsCircle = function(c){
  if(c.containsPoint(this.max)) return true;
  if(c.containsPoint(this.min)) return true;
  if(c.containsPoint(this.min.x,this.max.y)) return true;
  if(c.containsPoint(this.max.x,this.min.y)) return true;
  return false;
}

module.exports = AABB;
