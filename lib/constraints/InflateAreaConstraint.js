var Vec2 = require("../structures/Vec2");
var Line = require("../structures/Line");
var Triangle = require("../structures/Triangle");
var Polygon = require("../structures/Polygon");
var AABB = require("../structures/AABB");

/*
  Findout when we are intersecting ourself
  Findout when we go concave while intersecting ourself
  Findout when the intersection ends

  The Intersecting lines will be scaled relative to
  -How much of the line is on the positive side - Attempt to Expand
  -How much of the line is on the negative side - Attempt to shrink

  All lines that are in the negative area will attempt to shrink

*/


function AreaConstraint(points, stiffness) {
  if(Array.isArray(points)){
    //nothing
  }else{
    points = Array.prototype.slice.call(arguments,0);
    stiffness = points.pop();
  }
  if(points.length < 3){
    throw new Error("need at least three points in args or as an array to retain an area");
  }
  this.points = Polygon(points);
  this.area = this.points.getArea();
  this.storedarea = 0;
  this.storedmid = 0;
  this.storedaabb = new AABB();
  if(!this.area || this.area === 0){
    throw new Error("cannot calculate a nonexistant area");
  }
  this.stiffness = stiffness;
}

AreaConstraint.prototype.relax = function(stepCoef) {
  var area = 0;//the current area
  var mid = new Vec2();

  var l = this.points.length;
  this.points.forThree(function(prev,curr,next){
    area += curr.cross(next);
    mid.add(curr.clone().scale(1/l));
    //perimeter += curr.dist(next);
  });
  if(area <= 0){
    alert("negative area");
    throw new Error("negative area");
  }

  //I have the two areas
  var diff = (
    this.area* //The desired area
    (this.stiffness*stepCoef)+
    (1-this.stiffness*stepCoef)*
    area
  )/area;

  var _this = this;
  var eq = false;
  var lastcurr = this.points[this.points.length-1];
  var lastnext = this.points[0].clone();
  var _prev = this.points[this.points.length-1];
  var nm = new Vec2();
  this.points.forThree(function(prev,curr,next,i){
    var nl = curr.clone();
    curr.sub(_prev).scale(diff).add(prev);
    nm.add(curr.clone().scale(1/l));
    _prev = nl;
  });
  while(l--){
    this.points[l].sub(nm).add(mid);
  }
  this.storedarea = area*diff;
  this.storedmid = mid;
};

module.exports = AreaConstraint;

/*
A = Pir^2
P = 2Pir
P/2Pi = r
A = Pi*(P/(2Pi))^2
A = Pi/Pi^2 * P/2
A = P/2Pi

A = w*h
A/w = h
P = 2w+2h
P/2 = w+h
P/2 - w = h
A = w*(P/2 - w)
A = wP/2 - w^2
P = 2w + 2A/w

A = 1/2 * b * h
a/Sin(A) = b/Sin(b) = c/Sin(b)
b = find max side
c/Sin(90) = h/Sin(A)
Sin(A)*c/Sin(90) = h

A = 1/2 * b * Sin(A)*c/Sin(90)
P = a + b + c

So we know Area
-we know angles
Now we need to figure out the distances

a/Sin(A) = b/Sin(B) = c/Sin(C)

A = Sin(A)* Sin(C) * b^2 / (Sin(B)*Sin(90))
*/
