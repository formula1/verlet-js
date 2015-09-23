var generics = require('../generics');
module.exports = function(constraint){
constraint.prototype.draw = function(ctx) {
  if(!this.svgLines){
    var color = 'rgba(255,255,0,0.2)';
    this.svgLines = {};
    this.svgLines.ab = generics.line(this.a.pos,this.b.pos,5,color);
    ctx.appendChild(this.svgLines.ab);
    this.svgLines.bc = generics.line(this.b.pos,this.c.pos,5,color);
    ctx.appendChild(this.svgLines.bc);
  }
  this.svgLines.ab.svgUpdate(this.a.pos,this.b.pos);
  this.svgLines.ac.svgUpdate(this.b.pos,this.c.pos);
};
};
