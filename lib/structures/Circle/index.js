
var Vec2 = require("../Vec2");
var Line = require("../Line");
function Circle(midpoint, radius){
  /*
  Error checks slow things down;
  if(typeof radius != "number") throw new Error("radius needs to be a number");
  if(radius <= 0) throw new Error("radius needs to be greater than 0");
  if(!(midpoint instanceof Vec2)) throw new Error("midpoint needs to be a Vec2");
  */
  this.radius = radius;
  this.midpoint = midpoint;
  this.quadraticX = [1,2*-midpoint.x,midpoint.x*midpoint.x]
  this.quadraticY = [1,2*-midpoint.y,midpoint.y*midpoint.y]
}

Circle.construct2 = function(A,B){
  var midpoint = A.clone().add(B).scale(1/2);
  var radius = A.dist(B)/2;
  return new Circle(midpoint,radius);
}

Circle.construct3 = function(A,B,C){
  var pbAB = new Line(A, B)
  pbAB = pbAB.perpendicularBisector();
  var pbCB = (new Line(B, C))
  pbCB = pbCB.perpendicularBisector();
  var midpoint = pbAB.intersectsLine(pbCB);
  var radius = A.dist(midpoint);

  return new Circle(midpoint,radius);
}


var intersections = require("./intersections.js");

for(var i in intersections){
  Circle.prototype[i] = intersections[i];
}

var questions = require("./questions.js");

for(var i in questions){
  Circle.prototype[i] = questions[i];
}


module.exports = Circle;
