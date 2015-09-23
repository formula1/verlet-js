function DistanceConstraint(a, b, stiffness, distance /*optional*/) {
  this.a = a;
  this.b = b;
  this.distance = typeof distance != "undefined" ? distance : a.pos.clone().sub(b.pos).length();
  this.stiffness = stiffness;
}

DistanceConstraint.prototype.relax = function(stepCoef) {
  var normal = this.a.pos.clone().sub(this.b.pos);
  var m = normal.length2();
  normal.scale(((this.distance*this.distance - m)/m)*this.stiffness*stepCoef);
  this.a.pos.add(normal);
  this.b.pos.sub(normal);
};

module.exports = DistanceConstraint;
