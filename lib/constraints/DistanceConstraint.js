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
}

DistanceConstraint.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.moveTo(this.a.pos.x, this.a.pos.y);
  ctx.lineTo(this.b.pos.x, this.b.pos.y);
  ctx.strokeStyle = "#d8dde2";
  ctx.stroke();
}

module.exports = DistanceConstraint;
