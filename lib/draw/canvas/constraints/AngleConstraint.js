
module.exports = function(constraint){
constraint.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.moveTo(this.a.pos.x, this.a.pos.y);
  ctx.lineTo(this.b.pos.x, this.b.pos.y);
  ctx.lineTo(this.c.pos.x, this.c.pos.y);
  var tmp = ctx.lineWidth;
  ctx.lineWidth = 5;
  ctx.strokeStyle = "rgba(255,255,0,0.2)";
  ctx.stroke();
  ctx.lineWidth = tmp;
};
};