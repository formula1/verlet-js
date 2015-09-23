var generics = require('./generics');
require('../../structures/Particle').prototype.draw = function(ctx, big){
  if(!this.svgPoint){
    this.svgPoint = generics.circle(2,this.pos,"#2dad8f");
    ctx.appendChild(this.svgPoint);
  }
  if(big){
    this.svgPoint.r = '20';
  }else{
    this.svgPoint.r = '2';
  }
  this.svgPoint.svgUpdate(this.pos);
};