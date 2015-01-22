var Triangle = {};

Triangle.hasPoint = function(point){
  //http://www.blackpawn.com/texts/pointinpoly/
  // Compute vectors
  var v0 = this.C.clone().sub(this.B);
  var v1 = this.A.clone().sub(this.B);
  var v2 = point.clone().sub(this.B);

  // Compute dot products
  var dot00 = v0.dot(v0);
  var dot01 = v0.dot(v1);
  var dot02 = v0.dot(v2);
  var dot11 = v1.dot(v1);
  var dot12 = v1.dot(v2);

  // Compute barycentric coordinates
  var invDenom = 1 / (dot00 * dot11 - dot01 * dot01)
  var u = (dot11 * dot02 - dot01 * dot12) * invDenom
  var v = (dot00 * dot12 - dot01 * dot02) * invDenom

  // Check if point is in triangle
  return (u >= 0) && (v >= 0) && (u + v < 1)
}

module.exports = Triangle;
