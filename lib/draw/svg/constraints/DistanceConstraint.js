var generics = require('../generics');

module.exports = function(constraint){
constraint.prototype.draw = function(ctx) {
  if(!this.svgLine){
    this.svgLine = generics.line(this.a.pos,this.b.pos,1,"#d8dde2");
    ctx.appendChild(this.svgLine);
  }

  this.svgLine.svgUpdate(this.a.pos,this.b.pos);
};

};