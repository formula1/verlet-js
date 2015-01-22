var Vec2 = require("../structures/Vec2");
var Line = require("../structures/Line");
var Triangle = require("../structures/Triangle");
var Polygon = require("../structures/Polygon");
var AABB = require("../structures/AABB")


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
  if(!this.area || this.area == 0){
    throw new Error("cannot calculate a nonexistant area");
  }
  this.stiffness = stiffness;
}

AreaConstraint.prototype.relax = function(stepCoef) {
  var area = 0;//the current area
  var mid = new Vec2();

  var l = this.points.length;
  var extra = 0;
  this.points.forThree(function(prev,curr,next,index){
    if(curr.equals(next)){
      this.splice(index,1);
      extra++;
      return;
    }
    area += curr.cross(next);
    mid.add(curr);
    //perimeter += curr.dist(next);
  })
  mid.scaleI(l);
  if(area <= 0){
    alert("negative area");
    throw new Error("negative area");
  }

  //I have the two areas
  var diff = (
    this.area* //The desired area
    (this.stiffness*stepCoef)
    +(1-this.stiffness*stepCoef)
    *area
  )/area;

  var _this = this;
  var eq = false
  var lastcurr = this.points[this.points.length-1];
  var lastnext = this.points[0].clone();
  var _prev = this.points[this.points.length-1];
  var nm = new Vec2();
  this.points.forThree(function(prev,curr,next,i){
    var nl = curr.clone();
    curr.sub(_prev).scale(diff).add(prev);
    nm.add(curr.clone().scale(1/l))
    _prev = nl;
  })
  while(l--){
    this.points[l].sub(nm).add(mid);
  }
  this.storedarea = area*diff;
  this.storedmid = nm;
}
AreaConstraint.prototype.draw = function(ctx) {
  var diff = Math.floor(Math.min(255,255*this.area/this.storedarea));
  var inv = Math.floor(Math.min(255,255*this.storedarea/this.area));
  var _this = this;
  var problem = false;
  var intersects = [];
  var eq = false;
  var effectivepoints = [];
  //delaney
  /*
  var tri = this.points.getDelaney();
  for(i = tri.length; i; ) {
  ctx.beginPath();
  --i; ctx.moveTo(this.points[tri[i]].x, this.points[tri[i]].y);
  --i; ctx.lineTo(this.points[tri[i]].x, this.points[tri[i]].y);
  --i; ctx.lineTo(this.points[tri[i]].x, this.points[tri[i]].y);
  ctx.closePath();
  ctx.stroke();
}
*/


//draw perimiter
ctx.lineWidth = 4;
this.points.forThree(function(prev,curr,next,i){
  if(curr.equals(next)){
    eq = eq||prev
    return;
  }
  if(eq){
    prev = eq;
    eq = false;
  }
  effectivepoints.push(curr);
  var tri = new Triangle(prev,curr,next);

  var mp = tri.getConcaveBisector();

  var badarea = false;
  if( tri.CA.pointIsLeftOrTop(mp.B) == tri.CA.pointIsLeftOrTop(tri.B)){
    ctx.strokeStyle = "#FFFF00";
    if(tri.hasPoint(_this.storedmid)){
      problem = true;
    }
  }else{
    ctx.strokeStyle = "#FF00FF";
    if(tri.partialArea < 0){
      badarea = true;
    }
  }
  var intersections = _this.points.intersectsLine(new Line(prev,curr),i);
  if(intersections.length > 0){
    //        alert("you may get a negative area here");
    intersects = intersects.concat(intersections);
  }
  ctx.beginPath();
  ctx.moveTo((prev.x+curr.x)/2, (prev.y+curr.y)/2);
  ctx.lineTo(curr.x,curr.y);
  ctx.lineTo((next.x+curr.x)/2, (next.y+curr.y)/2);
  ctx.stroke();
  if(badarea){
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#FF0000";
  }
})
ctx.lineWidth = 1;
//fill
var l = effectivepoints.length-1;
ctx.beginPath();
ctx.moveTo(effectivepoints[l].x, effectivepoints[l].y);
while(l--){
  ctx.lineTo(effectivepoints[l].x,effectivepoints[l].y);
}
var g = (diff < inv)?diff:inv;
ctx.closePath();
ctx.fillStyle="rgba("+diff+","+g+","+inv+",0.6)";
ctx.fill();

//intersects
for(var i=intersects.length;i--;){
  ctx.beginPath();
  ctx.arc(
    intersects[i].x,
    intersects[i].y,
    8, 0, 2 * Math.PI, false
  );
  ctx.fillStyle = "#FF8300";
  ctx.fill();
};

//midpoint
ctx.beginPath();
ctx.arc(
  this.storedmid.x,
  this.storedmid.y,
  2, 0, 2 * Math.PI, false
);
ctx.fillStyle = problem?"#FF0000":"#00FF00";
ctx.fill();
}

module.exports = AreaConstraint;
