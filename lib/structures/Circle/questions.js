var Circle = {};
var Vec2 = require("../Vec2");
Circle.equals = function(circle){
  return this.midpoint.equals(circle.midpoint) && this.radius === circle.radius;
}

Circle.epsilonEquals = function(circle, epsilon) {
  return this.midpoint.epsilonEquals(circle.midpoint,epsilon)
  && Math.abs(this.radius - circle.radius) <= epsilon;
}

module.exports = Circle;
