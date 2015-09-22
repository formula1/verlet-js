var Vec2 = require("../Vec2");


var Polygon = {};

Polygon.getMidPoint = function(){
  var l = this.length;
  var mid = new Vec2();
  for(var i=this.length;i--;){
    mid.add(this[i].clone().scale(1/l));
  }
  return mid;
};

Polygon.getArea = function(){
  var net = 0;
  //http://www.wikihow.com/Calculate-the-Area-of-a-Polygon
  this.forThree(function(a,b,c){
    net += b.cross(c);
  });
  return net;
};

Polygon.getAABB = function(){
  var max = new Vec2(Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY);
  var min = new Vec2(Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY);
  for(var i=this.length;i--;){
    max.max(this[i]);
    min.min(this[i]);
  }
  return {max:max,min:min};
};

module.exports = Polygon;
