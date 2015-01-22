var Triangle = {};

Triangle.getConcaveBisector = function(){
  return this.CA.perpendicularBisector();
}
Triangle.AB = function(){
  return new Line(this.A,this.B);
}
Triangle.BC = function(){
  return new Line(B,C);
}
Triangle.CA = function(){
  return new Line(C,A);
}
Triangle.ABC = function(){
  return Math.lawCos(this.CA.length, this.AB.length, this.BC.length);
}
Triangle.BCA = function(){
  return Math.asin(Math.sin(this.ABC)*this.CA.length/this.AB.length);
}
Triangle.CAB = function(){
  return Math.asin(Math.sin(this.ABC)*this.BC.length/this.AB.length);
}
Triangle.perimiter = function(){
  return this.AB.length + this.BC.length + this.CA.length
}
Triangle.partialArea = function(){
  return this.AB.cross + this.BC.cross + this.CA.cross
}
Triangle.area = function(){
  return Math.abs(this.partialArea);
}

module.exports = Triangle;
