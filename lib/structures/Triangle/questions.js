
var Triangle = {};

var sqrt2 = Math.pow(2,1/2);

Triangle.isConcave = function(a,b,c){
  //rotate the points around B to make B and A parrallel to the X axis
  //If the line BC is negative, it is Concave
  //If the line BC is positive, it is Convex
  var ac = new Line(a,c);
  //  A should always be rotated -PI/2
  return ac.pointIsLeftOrTop(ac.perpendicularBisector().A)
    == ac.pointIsLeftOrTop(b);
  // return Math.sign(p.x) == Math.sign(b.x) && Math.sign(p.y) == Math.sign(b.y);
}

Triangle.anglePrimer = function(){
  return this.CA.length - sqrt2*(this.AB.length+this.BC.length)/2;
}

Triangle.isAcute = function(){
  return this.anglePrimer() < 0;
}

Triangle.isObtuse = function(){
  return this.anglePrimer() > 0;
}

Triangle.isRight = function(){
  return this.anglePrimer() == 0;
}

Triangle.equals = function(tri){
  return this.A.equals(tri.A)
  && this.B.equals(tri.B)
  && this.C.equals(tri.C);
}

Triangle.epsilonEquals = function(tri, epsilon) {
  return this.A.epsilonEquals(tri.A,epsilon)
  && this.B.epsilonEquals(tri.B,epsilon)
  && this.C.epsilonEquals(tri.C,epsilon);
}

Triangle.equalShape = function(tri) {
  return this.area == tri.area && this.perimiter == tri.perimiter
}

Triangle.epsilonEqualShape = function(tri,epsilon) {
  return Math.abs(this.area - tri.area)/27 <= epsilon
  && Math.abs(this.perimiter - tri.perimiter)/9 <= epsilon;
}

Triangle.equalAngles = function(tri) {
  var keys = ["ABC","BCA", "CAB"];
  var i = 3;
  var j;
  while(i--){
    j = 3;
    while(j--){
      if(this[keys[i]] == tri[keys[i]]) break;
    }
    if(j < 0) return false;
  }
  return true;
}


module.exports = Triangle;
