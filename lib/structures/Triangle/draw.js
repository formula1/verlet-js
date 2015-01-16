var Triangle = {};

Triangle.drawConcaveBisector = function(ctx){
  var mp = this.getConcaveBisector();
  ctx.beginPath();
  ctx.arc(
    mp.mid.x,
    mp.mid.y,
    8, 0, 2 * Math.PI, false
  );
  ctx.fillStyle = "#FF00FF";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(
    mp.B.x,
    mp.B.y,
    8, 0, 2 * Math.PI, false
  );
  ctx.fillStyle = "#FFFF00";
  ctx.fill();
  ctx.strokeStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.moveTo(mp.mid.x,mp.mid.y);
  ctx.lineTo(mp.B.x,mp.B.y);
  ctx.stroke();
}
