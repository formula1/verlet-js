
require('../../structures/Particle').prototype.draw = function(ctx, big){
  ctx.beginPath();
  if(big){
    ctx.arc(this.pos.x, this.pos.y, 20, 0, 2*Math.PI);
  }else{
    ctx.arc(this.pos.x, this.pos.y, 2, 0, 2*Math.PI);
  }
  ctx.fillStyle = "#2dad8f";
  ctx.fill();
};