var Vec2 = require("../Vec2");
var Line = require("../Line");

function AABB (points){
  this.max = new Vec2().neginf();
  this.min = new Vec2().posinf();
  if(points){
    var l;
    if(arguments.length > 1){
      l = arguments.length;
      while(l--){this.digestPoint(arguments[l]);}
    }else{
      l = points.length;
      while(l--){this.digestPoint(points[l]);}
    }
  }
}

AABB.prototype.clone = function(){
  return new AABB(this.max,this.min);
};

AABB.prototype.toArray = function(){
  return this.min.toArray().concat(this.max.toArray());
};

AABB.prototype.clear = function(){
  this.max.neginf();
  this.min.posinf();
};

AABB.prototype.digestPoint = function(point){
  this.max.max(point);
  this.min.min(point);
};

AABB.prototype.intersectsAABB = function(oAABB){
  if(this.min.x > oAABB.max.x) return false;
  if(this.min.y > oAABB.max.y) return false;
  if(oAABB.min.x > this.max.x) return false;
  if(oAABB.min.y > this.max.y) return false;
  return true;
};

AABB.prototype.sub = function(oAABB){
  this.min.max(oAABB.min);
  this.max.min(oAABB.max);
  return this;
};

AABB.prototype.containsPoint = function(point){
  if(point.x > this.max.x) return false;
  if(point.y > this.max.y) return false;
  if(point.x < this.min.x) return false;
  if(point.y < this.min.y) return false;
  return true;
};

AABB.prototype.intersectsLine = function(line){
  var tline = new Line(this.max, new Vec2(this.min.x,this.max.y));
  if(tline.intersectsLineSegment(line)) return true;

  tline = new Line(this.max, new Vec2(this.max.x,this.min.y));
  if(tline.intersectsLineSegment(line)) return true;

  tline = new Line(this.min, new Vec2(this.max.x,this.min.y));
  if(tline.intersectsLineSegment(line)) return true;

  tline = new Line(this.min, new Vec2(this.min.x,this.max.y));
  if(tline.intersectsLineSegment(line)) return true;

  return false;
};


AABB.prototype.intersectsCircle = function(c){
  if(c.containsPoint(this.max)) return true;
  if(c.containsPoint(this.min)) return true;
  if(c.containsPoint(new Vec2(this.min.x,this.max.y))) return true;
  if(c.containsPoint(new Vec2(this.max.x,this.min.y))) return true;
  return false;
};

AABB.prototype.getSuspects = require('./suspects.js');

module.exports = AABB;
