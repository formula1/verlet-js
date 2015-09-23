function AngleConstraint(a, b, c, stiffness) {
  this.a = a;
  this.b = b;
  this.c = c;
  this.angle = this.b.pos.angle2(this.a.pos, this.c.pos);
  this.stiffness = stiffness;
}

AngleConstraint.prototype.relax = function(stepCoef) {
  var angle = this.b.pos.angle2(this.a.pos, this.c.pos);
  var diff = angle - this.angle;

  if (diff <= -Math.PI)
    diff += 2*Math.PI;
  else if (diff >= Math.PI)
    diff -= 2*Math.PI;

  diff *= stepCoef*this.stiffness;

  this.a.pos.rotate(this.b.pos, diff);
  this.c.pos.rotate(this.b.pos, -diff);
  this.b.pos.rotate(this.a.pos, diff);
  this.b.pos.rotate(this.c.pos, -diff);
};

module.exports = AngleConstraint;
