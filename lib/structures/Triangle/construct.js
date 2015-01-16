
var Circle = require("../Circle");
var Triangle = {};

Triangle.getInsideCircle = function(a,b,c){
  return Circle.construct3(this.BC.mid,this.CA.mid,this.AB.mid);
}
Triangle.getOutsideCircle = function(){
  return Circle.construct3(this.A,this.B,this.C);
}
Triangle.getConcaveBisector = function(){
  return this.CA.perpendicularBisector();
}
module.exports = Triangle;
/*
Triangle.getCircumCircle = function(tri){
  var x1 = a.x,
  y1 = a.y,
  x2 = b.x,
  y2 = b.y,
  x3 = c.x,
  y3 = c.y,
  fabsy1y2 = Math.abs(y1 - y2),
  fabsy2y3 = Math.abs(y2 - y3),
  xc, yc, m1, m2, mx1, mx2, my1, my2, dx, dy;
  // Check for coincident points
  if(fabsy1y2 < EPSILON && fabsy2y3 < EPSILON){
    throw new Error("Eek! Coincident points!");
  }
  if(fabsy1y2 < EPSILON) {
    m2 = -((x3 - x2) / (y3 - y2));
    mx2 = (x2 + x3) / 2.0;
    my2 = (y2 + y3) / 2.0;
    xc = (x2 + x1) / 2.0;
    yc = m2 * (xc - mx2) + my2;
  }
  else if(fabsy2y3 < EPSILON) {
    m1 = -((x2 - x1) / (y2 - y1));
    mx1 = (x1 + x2) / 2.0;
    my1 = (y1 + y2) / 2.0;
    xc = (x3 + x2) / 2.0;
    yc = m1 * (xc - mx1) + my1;
  }
  else {
    m1 = -((x2 - x1) / (y2 - y1));
    m2 = -((x3 - x2) / (y3 - y2));
    mx1 = (x1 + x2) / 2.0;
    mx2 = (x2 + x3) / 2.0;
    my1 = (y1 + y2) / 2.0;
    my2 = (y2 + y3) / 2.0;
    xc = (m1 * mx1 - m2 * mx2 + my2 - my1) / (m1 - m2);
    yc = (fabsy1y2 > fabsy2y3) ?
    m1 * (xc - mx1) + my1 :
    m2 * (xc - mx2) + my2;
  }
  dx = x2 - xc;
  dy = y2 - yc;
  return new Circle(new Vec2(xc,yc),dx * dx + dy * dy);
}
*/
