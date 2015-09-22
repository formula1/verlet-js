var Line = {};

Line.equals = function(line){
  return this.A.equals(line.A) && this.B.equals(line.B);
};

Line.epsilonEquals = function(line, epsilon) {
  return this.A.epsilonEquals(line.A,epsilon) && this.B.epsilonEquals(line.B,epsilon);
};

Line.equalSlope = function(line) {
  return this.slope.equals(line.slope)&& 
  (this.xint)?this.xint == line.xint :
  this.yint == line.yint;
};

Line.epsilonEqualSlope = function(line, epsilon) {
  return this.slope.epsilonEquals(line.slope,epsilon) &&
  (this.xint)?Math.abs(this.xint - line.xint) <= epsilon :
  Math.abs(this.yint - line.yint) <= epsilon;
};

Line.equalMagnitude = function(line) {
  return this.slope.equals(line.slope) &&
  this.length == line.length;
};

Line.epsilonEqualMagnitude = function(line, epsilon) {
  return this.slope.epsilonEquals(line.slope,epsilon) &&
  Math.abs(this.length - line.length) <= epsilon;
};


module.exports =  Line;
