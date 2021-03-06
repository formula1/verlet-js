var Vec2 = require("../Vec2");


function Line(A,B){
  if(A.equals(B))
    throw new Error("cannot construct line when A == B");
  this.A = A;
  this.B = B;

  this.angledSlope = A.clone().sub(B).normalize();
  this.slope = this.angledSlope.scale(
    Math.sign(this.angledSlope.x)||Math.sign(this.angledSlope.y)
  );
  this.inv_slope = (this.slope.y == 0)?false:this.slope.x/this.slope.y;
  this.true_slope = (this.slope.x == 0)?false:this.slope.y/this.slope.x;
  this.yint = (this.true_slope !== false)?-this.true_slope*A.x + A.y:false;
  this.xint = (this.inv_slope !== false)?-this.inv_slope*A.y + A.x:false;

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

var interesctions = require("./intersects.js");

for(var i in interesctions){
  Line.prototype[i] = interesctions[i];
}
var eq = require("./questions.js");

for(var i in eq){
  Line.prototype[i] = eq[i];
}

//This should be in cacheable
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

Line.prototype.getYValue = function(x){
  if(!this.slope.x) return false;
  return  x*this.true_slope + this.yint;
};

Line.prototype.getXValue = function(y){
  if(!this.slope.y) return false;
  return  y*this.inv_slope + this.xint;
};


module.exports = Line;
