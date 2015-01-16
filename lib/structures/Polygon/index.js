function Polygon(oPoints){
  var i = oPoints.length;
  var points = Array(i);
  while (i--) {
    points[i] = oPoints[i].pos||oPoints[i];
  }
  for(var i in Polygon.prototype){
    Object.defineProperty(points,i,{
      enumerable: false,
      value: Polygon.prototype[i].bind(points)
    });
  }
  Object.defineProperty(points,"clean",{
    enumerable: false,
    value: false
  });
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
}

Polygon.prototype.forThree = function(fn,skip){
  var l = this.length;
  if(!this.clean){
    for(var i=skip||0;i<l;i++){
      var prev = (i+l-1)%l;//((i == 0)?l:i) -1
      var curr = i;
      var next = (i+1)%l; //i == l-1?0:i+1
      this[prev] = this[prev].pos||this[prev];
      this[curr] = this[curr].pos||this[curr];
      this[next] = this[next].pos||this[next];
      fn.call(this,this[prev],this[curr],this[next], curr);
    }
    this.clean = true;
  }else{
    for(var i=skip||0;i<l;i++){
      var prev = (i+l-1)%l;//((i == 0)?l:i) -1
      var curr = i;
      var next = (i+1)%l; //i == l-1?0:i+1
      fn.call(this,this[prev],this[curr],this[next], curr);
    }
  }
}

var cachable = require("./cachable");
for(var i in cachable){
  Polygon.prototype[i] = cachable[i]
}
var intersects = require("./intersects");
for(var i in intersects){
  Polygon.prototype[i] = intersects[i]
}

module.exports = Polygon;
