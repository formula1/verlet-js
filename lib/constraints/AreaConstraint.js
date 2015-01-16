var Vec2 = require("../structures/Vec2");
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
  this.points.forThree(function(prev,curr,next){
    area += curr.cross(next);
    mid.add(curr.clone().scale(1/l))
  })
  if(area <= 0){
    alert("negative area");
    throw new Error("negative area");
  }

  //I have the two areas
  var diff = Math.sqrt((
    this.area* //The desired area
    (this.stiffness*stepCoef)
    +(1-this.stiffness*stepCoef)
    *area
  )/area);

  //I want to have all points to either push away from the mid or towards the mid
  //The extremity is dependent on the distance
  //Get the distance between mid and point
  //make the distance the appropriate proportion
  this.storedarea = 0;
  this.storedmid = new Vec2();


  var _this = this;
  var eq = false
  var curr_array = [];
  this.points.forThree(function(prev,curr,next,i){
    var ok = true;
    /*
    if(curr.equals(next)){
      eq = prev;
      curr_array.push(curr);
      return;
    }
    if(eq){
      prev = eq;
      eq = false;
      curr_array.push(curr)

    }
    */
    var tri = new Triangle(prev,curr,next);
    if(tri.isConcave()){
      if(tri.hasPoint(_this.storedmid)){
        problem = true;
      }
      var intersections = _this.points.getIntersects(prev,curr,i);
      if(intersections.length > 0){
        //alert("you may get a negative area here");
        ok = false;
      }
    }
    if(ok){}
    /*
    if(curr_array.length){
      while(curr_array.length){
        _this.storedmid.add(
          curr_array.pop().sub(mid).scale(diff).add(mid)
          .clone().scale(1/l)
        );
      }
    }else{
    */
      _this.storedmid.add(
        curr.sub(mid).scale(diff).add(mid)
        .clone().scale(1/l)
      );
//    }

    if(curr != _this.points[0]){
      _this.storedarea += prev.cross(curr);
    }
    _this.storedaabb.digestPoint(curr);
  })
}
AreaConstraint.prototype.draw = function(ctx) {
  var diff = Math.floor(Math.min(255,255*this.area/this.storedarea));
  var inv = Math.floor(Math.min(255,255*this.storedarea/this.area));
  ctx.beginPath();
  ctx.moveTo(this.points[0].x, this.points[0].y);
  var _this = this;
  var problem = false;
  var intersects = [];
  var eq = false;
  this.points.forThree(function(prev,curr,next,i){
    /*
    if(curr.equals(next)){
      eq = prev
      return;
    }
    if(eq){
      prev = eq;
      eq = false;
    }
    */
    var tri = new Triangle(prev,curr,next);
    if(tri.isConcave()){
      if(tri.hasPoint(_this.storedmid)){
        problem = true;
      }
    }
    var intersections = _this.points.getIntersects(prev,curr,i);
    if(intersections.length > 0){
      //        alert("you may get a negative area here");
      intersects = intersects.concat(intersections);
    }
    ctx.lineTo(curr.x,curr.y);
  })

  var g = (diff < inv)?diff:inv;
  ctx.closePath();
  ctx.fillStyle="rgba("+diff+","+g+","+inv+",0.6)";
  ctx.fill();


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

  var tri = this.points.getDelaney();
  for(i = tri.length; i; ) {
    ctx.beginPath();
    --i; ctx.moveTo(this.points[tri[i]].x, this.points[tri[i]].y);
    --i; ctx.lineTo(this.points[tri[i]].x, this.points[tri[i]].y);
    --i; ctx.lineTo(this.points[tri[i]].x, this.points[tri[i]].y);
    ctx.closePath();
    ctx.stroke();
  }

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


//finding half the area of a circle
// A = pi * r^2
// A/2 = pi/2 * r^2
// dA = pi/d * r^2
// we know current area
// we know desired area
// (dA/cA) * cA = (dA/cA) * pi * r^2
// we're looking for the change in r that corresponds to change in A
// sqrt(A/pi) = r

//new_r = (circle_r/sqrt(Area))


// we find the porportion between cur and desired
// multiply current distance by that porportion

//	diff = 1/Math.sqrt(diff);
//	diff *= stepCoef*this.stiffness;
/*
This code will not work properly since pushing outward may not work for certian
concave polygons

What is needed is to find a single multiplier that the distance between each point
can be multiplied by to give the area desired

I good example is something such as

There are a few issues here
1) backwards points
- The moment it intersects, we get negative area
2) Intersections around midpoint
- the moment it intersects around the midpoint, it will go haywire
- Can we detect if the angle passes over the midpoint?
-should we compensate for that?
3) The midpoint pushing outward concept actually enforces angle
-It causes angles to generally want to be equalateral
4) Concave till ignoring midpoint
5) midpoint is technically at the bottom despite most of the area being up top
-This problem is where we are calculating the midpoint based of angle points
-Instead of basing it off all points (line segments are points technically)
-sampling points off each segment will give an innaccurate calculation
-after finding total perimiter, is it possible to base the amount of influence
-off of length?


*/
