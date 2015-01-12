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
  }

  AngleConstraint.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.a.pos.x, this.a.pos.y);
    ctx.lineTo(this.b.pos.x, this.b.pos.y);
    ctx.lineTo(this.c.pos.x, this.c.pos.y);
    var tmp = ctx.lineWidth;
    ctx.lineWidth = 5;
    ctx.strokeStyle = "rgba(255,255,0,0.2)";
    ctx.stroke();
    ctx.lineWidth = tmp;
  }

  module.exports = AngleConstraint;
