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
  //var perimeter = 0;
  var l = this.points.length;
  this.points.forThree(function(prev,curr,next){
    area += curr.cross(next);
    mid.add(curr.clone().scale(1/l))
    //perimeter += curr.dist(next);
  })
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


//  b = Math.sqrt(Area*(Sin(B)*Sin(90))/(Sin(A)*Sin(C)))

  var _this = this;
  var eq = false
  var lastcurr = this.points[this.points.length-1];
  var lastnext = this.points[0].clone();
  var _prev = this.points[this.points.length-1];
  var nm = new Vec2();
  this.points.forThree(function(prev,curr,next,i){
    //If I didn't need every length, I wouldn't grab it
    var la = curr.dist(next);
    var lb = next.dist(_prev);
    var lc = _prev.dist(curr);

    var nl = curr.clone();
    //subtract old prev, normalize, scale to new length, add new prev
    curr.sub(_prev).scale(diff).add(prev);
    nm.add(curr.clone().scale(1/l))
    /*    */
    // set a
    _prev = nl;
    /*

    var Aa = Math.acos((lb*lb + lc*lc -la*la) / (2*lb*lc) );
    var Aasin = Math.sin(Aa); //Cache the sine

    //    var Ab = Math.asin(lb*Aasin/la);
//    var Absin = Math.sin(Ab);
//    var Ac = Math.asin(lc*Aasin/la);
//    var Acsin = Math.sin(Ac);

    // A = b*h / 2
    // If a line would be created at Angle B that is perpendicular to the base
    // both line c and line a would now be considered hypotenuses
    // we consider one the hypotenuse and the otherone now has the opposite angle
    // Law of sines - opp/sin(A) = linec/(sin(90) = 1)
    // opp = sin(A)*linec
//    var Area = 0.5 * lb * Aasin*lc;
    //this is an alternative, though we already have the sine so it may be slower
//    var Area = curr.cross(next) + next.cross(prev) + prev.cross(curr);
/*
heavy abuse of law of sines
 lc = lb*sin(C)/sin(B)
 Area = .5 * lb * sin(A) * lb * sin(C) / sin(B)
 Area * sin(B) * 2 / sin(A) /sin(C) = lb^2
 sqrt(Area * sin(B) * 2 / sin(A) /sin(C)) = lb
  var nb = Math.sqrt(
    Area * 2 * (Absin)
  /
    (Aasin * Acsin)
  );
  I would never use Sin(C) nor sin(B) again
  var nc = Math.sqrt(
    Area * 2 * Math.asin(lc*Aasin/la)
  /
    (Aasin * Math.asin(lb*Aasin/la))
  );

  var nc = Math.sqrt(
    0.5 * lb * Aasin * lc * 2 Math.asin(lc*Aasin/la)
  /
    (Aasin * Math.asin(lb*Aasin/la))

  var nc = Math.sqrt(
    lb * Aasin * lc * Math.asin(lc*Aasin/la)
  /
    (Aasin * Math.asin(lb*Aasin/la))
  )

  var nc = Math.sqrt(
    lb * lc * Math.asin(lc*Aasin/la)
  /
    Math.asin(lb*Aasin/la)
  }
*/
//  NewSmallArea/SmallArea = NewBigArea/BigArea
//  NewSmallArea = NewBigArea*SmallArea/BigArea

//Done in one sweep
/*
    var nc = Math.sqrt(
      lb * lc * Math.asin(lc*Aasin/la)
    /
      (Math.asin(lb*Aasin/la) )
    );


    //store the next points old prev
    var nl = curr.clone()
    //subtract old prev, normalize, scale to new length, add new prev
    curr.sub(_prev).normalize().scale(nc).add(prev);
    nm.add(curr.clone().scale(1/l))
/*    */
    // set a
//    _prev = nl;
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
  var tri = this.points.getDelaney();
  for(i = tri.length; i; ) {
    ctx.beginPath();
    --i; ctx.moveTo(this.points[tri[i]].x, this.points[tri[i]].y);
    --i; ctx.lineTo(this.points[tri[i]].x, this.points[tri[i]].y);
    --i; ctx.lineTo(this.points[tri[i]].x, this.points[tri[i]].y);
    ctx.closePath();
    ctx.stroke();
  }


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
    ctx.beginPath();
    ctx.arc(
      curr.x,
      curr.y,
      4, 0, 2 * Math.PI, false
    );
    ctx.fillStyle = "#FFFF00";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      prev.x,
      prev.y,
      4, 0, 2 * Math.PI, false
    );
    ctx.fillStyle = "#FF00FF";
    ctx.fill();
    var mp = tri.getConcaveBisector();
    ctx.beginPath();
    ctx.arc(
      mp.mid.x,
      mp.mid.y,
      8, 0, 2 * Math.PI, false
    );
    ctx.fillStyle = "#FF00FF";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      mp.B.x,
      mp.B.y,
      8, 0, 2 * Math.PI, false
    );
    ctx.fillStyle = "#FFFF00";
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.moveTo(mp.mid.x,mp.mid.y);
    ctx.lineTo(mp.B.x,mp.B.y);
    ctx.stroke();

    if( tri.CA.pointIsLeftOrTop(mp.B) != tri.CA.pointIsLeftOrTop(tri.B)){

      ctx.strokeStyle = "#FFFF00";
      if(tri.hasPoint(_this.storedmid)){
        problem = true;
      }
    }else{
      ctx.strokeStyle = "#FF00FF";
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
