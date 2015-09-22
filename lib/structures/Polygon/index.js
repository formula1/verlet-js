function Polygon(oPoints){
  var l = oPoints.length;
  var i = l;
  var points = Array(i);
  while (i--) {
    points[l-i-1] = oPoints[i].pos||oPoints[i];
  }
  for(i in Polygon.prototype){
    Object.defineProperty(points,i,{
      enumerable: false,
      value: Polygon.prototype[i].bind(points)
    });
  }
  return points;
}

Polygon.prototype.clone = function(){
  var points = this.slice(0);
  for(var i in Polygon.prototype){
    Object.defineProperty(points,i,{
      enumerable: false,
      value:Polygon.prototype[i].bind(points)
    });
  }
  return points;
};

Polygon.prototype.forThree = function(fn,skip){
  var l = this.length;
  var i = l - (skip||0);
  while(i--){
    var prev = (i+1)%l;//((i == 0)?l:i) -1
    var curr = i;
    var next = (i+l-1)%l; //i == l-1?0:i+1
    fn.call(this,this[prev],this[curr],this[next], curr);
  }
};

var cachable = require("./cacheable");
for(var i in cachable){
  Polygon.prototype[i] = cachable[i];
}
var intersects = require("./intersects");
for(var i in intersects){
  Polygon.prototype[i] = intersects[i];
}

module.exports = Polygon;
