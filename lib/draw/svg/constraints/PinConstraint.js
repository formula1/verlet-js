var generics = require('../generics');

module.exports = function(constraint){
constraint.prototype.draw = function(ctx) {
  if(!this.svgPoint){
    this.svgPoint = generics.circle(6,this.pos,"rgba(0,153,255,0.1)");
    ctx.appendChild(this.svgPoint);
  }
  this.svgPoint.svgUpdate(this.pos);
};
};