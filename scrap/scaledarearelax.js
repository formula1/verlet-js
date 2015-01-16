
AreaConstraint.prototype.relax = function(stepCoef) {
  var area = 0;//the current area
  var mid = new Vec2();
  //var perimeter = 0;
  console.time();

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
console.timeEnd();
}
