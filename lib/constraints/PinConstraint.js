var Vec2 = require("../structures/Vec2")

function PinConstraint(a, pos) {
  this.a = a;
  this.pos = (new Vec2()).set(pos);
}

PinConstraint.prototype.relax = function(stepCoef) {
  this.a.pos.set(this.pos);
}

PinConstraint.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.arc(this.pos.x, this.pos.y, 6, 0, 2*Math.PI);
  ctx.fillStyle = "rgba(0,153,255,0.1)";
  ctx.fill();
}

module.exports = PinConstraint;
