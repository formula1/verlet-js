
var Vec2 = require("./Vec2");
var Line = require("./Line");

function Polygon(points){
  if(arguments.length == 0){
    points = [];
  }
  if(!Array.isArray(points)){
    if(arguments.length > 1){
      points = Array.prototype.slice.call(arguments,0);
    }else{
      throw new Error("arguments must either be >=3 or an Array that is >= 3");
    }
  }
  if(points.length < 3) throw new Error("point groups must be a minimum of 3");
  if(points instanceof Polygon)
    return points;
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
    fn(this[prev],this[curr],this[next], curr);
  }
}

Polygon.prototype.getIntersects = function(tprev,tcurr,skip){
  //creating smaller aabbs
  //We're going to detect intersection by slope
  //however, the point of intersection may be outside of the of the possible area
  //as a result we're creating a smaller aabb thats the maxes and minimums of the current area

  var tAABB = {
    max: tprev.pos.max(tcurr.pos),
    min: tprev.pos.min(tcurr.pos)
  };
  var tAB_line = new Line(tprev,tcurr);

  var intersections = [];

  this.forThree(function(oprev,ocurr,onext){
    if(tcurr.pos.equals(ocurr.pos)) return;
    if(tcurr.pos.equals(oprev.pos)) return;
    if(oprev.pos.equals(tcurr.pos)) return;
    var oAABB = {
      max: oprev.pos.max(ocurr.pos),
      min: oprev.pos.min(ocurr.pos)
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
  var l = points.length;
  var mid = new Vec2();
  //http://www.wikihow.com/Calculate-the-Area-of-a-Polygon
  this.forEach(function(point){
    mid = mid.add(point.pos.scale(1/l));
  })
  return mid;
}

Polygon.prototype.getArea = function(){
  var net = 0;
  //http://www.wikihow.com/Calculate-the-Area-of-a-Polygon
  this.forThree(function(a,b,c){
    net += b.pos.cross(c.pos);
  })
  return net;
}

Polygon.prototype.getAABB = function(){
  var max = new Vec2(-Number.Infinity,-Number.Infinity);
  var min = new Vec2(Number.Infinity,Number.Infinity);
  this.forEach(function(point){
    if(point.x < min.x) min.x = point.x;
    else if(point.x > max.x) max.x = point.x;
    if(point.y < min.y) min.y = point.y;
    else if(point.y > max.y) max.y = point.y
  })
  return {max:max,min:min};
}

Polygon.triangleHasPoint = function(a,b,c,point){
  //http://www.blackpawn.com/texts/pointinpoly/
  // Compute vectors
  var v0 = c.pos.sub(b.pos);
  var v1 = a.pos.sub(b.pos);
  var v2 = point.sub(b.pos);

  // Compute dot products
  var dot00 = v0.dot(v0);
  var dot01 = v0.dot(v1);
  var dot02 = v0.dot(v2);
  var dot11 = v1.dot(v1);
  var dot12 = v1.dot(v2);

  // Compute barycentric coordinates
  var invDenom = 1 / (dot00 * dot11 - dot01 * dot01)
  var u = (dot11 * dot02 - dot01 * dot12) * invDenom
  var v = (dot00 * dot12 - dot01 * dot02) * invDenom

  // Check if point is in triangle
  return (u >= 0) && (v >= 0) && (u + v < 1)
}

Polygon.triangleIsConcave = function(a,b,c){
  //rotate the points around B to make B and A parrallel to the X axis
  //If the line BC is negative, it is Concave
  //If the line BC is positive, it is Convex

  var ABhyp = a.pos.dist(b.pos);
  var ABopp = b.pos.y - a.pos.y

  var ABrotate = Math.asin(ABopp/ABhyp);
  var Anew = a.pos.rotate(b.pos,ABrotate);
  var Cnew = c.pos.rotate(b.pos,ABrotate);

  ACadj = c.pos.x - a.pos.x;
  ACopp = c.pos.y - a.pos.y;
  if(ACadj == 0){
    //We are also considering if they are the exact same point to be concave
    return (ACopp < 0)
  }
  //We are also considering straight line to be convex
  return (ACopp/ACadj > 0);
}


module.exports = Polygon;
