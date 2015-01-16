var Vec2 = require("../Vec2");


function Line(A,B){
  if(A.equals(B))
    throw new Error("cannot construct line when A == B");
  this.angledSlope = A.clone().sub(B).normalize();
  this.slope = this.angledSlope.scale(
    Math.sign(this.angledSlope.x)||Math.sign(this.angledSlope.y)
  );
  this.inv_slope = (this.slope.y == 0)?false:this.slope.x/this.slope.y;
  this.true_slope = (this.slope.x == 0)?false:this.slope.y/this.slope.x;
  this.yint = (this.true_slope !== false)?-this.true_slope*A.x + A.y:false;
  this.xint = (this.inv_slope !== false)?-this.inv_slope*A.y + A.x:false;

  this.A = A;
  this.B = B;
  this.mid = A.clone().mid(B);
  this.length2 = A.dist2(B);
  this.length = Math.sqrt(this.length2);
  this.cross = A.cross(B);
}

Line.prototype.toString = function(){
  return "limits:["+A+","+B+"]," +
  "intercepts:("+this.yint+","+thisxint+")";
  "slope:("+this.slope+"), ";
}

Line.prototype.opposite = function(){
  return this.B.y - this.A.y;
}

Line.prototype.adjacent = function(){
  return this.B.x - this.A.x;
}

Line.prototype.perpendicularBisector = function(){
  var mid = this.mid;
  var A = this.A.clone().sub(mid).swap();
  var B = A.clone();
  A.y *= -1
  B.x *= -1;
  A.add(mid);
  B.add(mid);
  return new Line(A,B);
}

var interesctions = require("./intersections.js");

for(var i in interesctions){
  Line.prototype[i] = interesctions[i];
}
var eq = require("./equals.js");

for(var i in eq){
  Line.prototype[i] = eq[i];
}

module.exports = Line;
