
var Vec2 = require("./Vec2");
var Line = require("./Line");
var Circle = require("./Circle");
var Delaney = require("delaunay-fast")

function Polygon(points){
  if(arguments.length == 0){
    points = [];
  }
  if(points instanceof Polygon)
    return points;
  points = Vec2.overloadArguments(
    arguments,
    Polygon.lengthTest
  );
  for(var i in Polygon.prototype){
    Object.defineProperty(points,i,{
      enumerable: false,
      value:Polygon.prototype[i].bind(points)
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
}


Polygon.prototype.forThree = function(fn,skip){
  var l = this.length;
  for(var i=skip||0;i<l;i++){
    var prev = (i+l-1)%l;//((i == 0)?l:i) -1
    var curr = i;
    var next = (i+1)%l; //i == l-1?0:i+1
    fn.call(this,this[prev],this[curr],this[next], curr);
  }
}

Polygon.prototype.getIntersects = function(tprev,tcurr,skip){
  //creating smaller aabbs
  //We're going to detect intersection by slope
  //however, the point of intersection may be outside of the of the possible area
  //as a result we're creating a smaller aabb thats the maxes and minimums of the current area

  var tAABB = {
    max: tprev.max(tcurr),
    min: tprev.min(tcurr)
  };
  var tAB_line = new Line(tprev,tcurr);

  var intersections = [];

  this.forThree(function(oprev,ocurr,onext){
    if(tcurr == ocurr) return;
    if(tcurr == oprev) return;
    if(oprev == tcurr) return;
    var oAABB = {
      max: oprev.max(ocurr),
      min: oprev.min(ocurr)
    };

    if(tAABB.min.x >= oAABB.max.x) return;
    if(tAABB.min.y >= oAABB.max.y) return;
    if(oAABB.min.x >= tAABB.max.x) return;
    if(oAABB.min.y >= tAABB.max.y) return;

    //I would like to cache the oprev->ocurr line if possible
    //I would also prefer searching only for lines with the appropiate AABBs
    var intersect = tAB_line.getIntersection(oprev,ocurr);
    if(!intersect) return;

    var netAABB = {
      max: oAABB.max.min(tAABB.max),
      min: oAABB.min.max(tAABB.min)
    };
    //If intersect point isn't between the two points, this isn't for us.
    if(intersect.x >= netAABB.max.x) return;
    if(intersect.y >= netAABB.max.y) return;
    if(intersect.x <= netAABB.min.x) return;
    if(intersect.y <= netAABB.min.y) return;

    intersections.push(intersect);

  },skip);

  return intersections;
}

Polygon.prototype.getMidPoint = function(){
  var l = this.length;
  var mid = new Vec2();
  for(var i=this.length;i--;){
    mid.add(this[i].clone().scale(1/l));
  };
  return mid;
}

Polygon.prototype.getArea = function(){
  var net = 0;
  //http://www.wikihow.com/Calculate-the-Area-of-a-Polygon
  this.forThree(function(a,b,c){
    net += b.cross(c);
  })
  return net;
}

Polygon.prototype.getAABB = function(){
  var max = new Vec2(-Number.Infinity,-Number.Infinity);
  var min = new Vec2(Number.Infinity,Number.Infinity);
  for(var i=this.length;i--;){
    max = max.max(this[i]);
    min = min.min(this[i]);
  }
  return {max:max,min:min};
}

Polygon.prototype.getDelaney = function(){
  return Delaney.triangulate(this,"asArray");
}


Polygon.lengthTest = function(length){
  return (length>3)?length:false;
}

module.exports = Polygon;
