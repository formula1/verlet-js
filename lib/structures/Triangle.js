var Vec2 = require("./Vec2");
var Circle = require("./Circle");


function Triangle(){
  var args = Vec2.overloadArguments(
    arguments,
    Triangle.lengthTest,
    Triangle.iterateTest
  )
  this.A = args[0];
  this.B = args[1];
  this.C = args[2];
}

Triangle.prototype.getCircumCircle = function(){
  return Triangle.getCircumCircle(this.A,this.B,this.C);
}

Triangle.prototype.isConcave = function(){
  return Triangle.isConcave(this.A,this.B,this.C);
}

Triangle.prototype.hasPoint = function(point){
  return Triangle.hasPoint(this.A,this.B,this.C,point);
}

Triangle.lengthTest = function(length){
  return (length == 3)?3:false;
}

Triangle.iterateTest = function(i,args){
  if(i == 0) return;
  if(args[i-1].equals(args[i])){
    throw new Error("Cannot build when argument["+(i-1)+"] == argument["+i+"]");
  }
}


Triangle.getCircumCircle = function(a,b,c){
  var x1 = a.x,
  y1 = a.y,
  x2 = b.x,
  y2 = b.y,
  x3 = c.x,
  y3 = c.y,
  fabsy1y2 = Math.abs(y1 - y2),
  fabsy2y3 = Math.abs(y2 - y3),
  xc, yc, m1, m2, mx1, mx2, my1, my2, dx, dy;
  /* Check for coincident points */
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

Triangle.hasPoint = function(a,b,c,point){
  //http://www.blackpawn.com/texts/pointinpoly/
  // Compute vectors
  var v0 = c.clone().sub(b);
  var v1 = a.clone().sub(b);
  var v2 = point.clone().sub(b);

  // Compute dot products
  var dot00 = v0.dot(v0);
  var dot01 = v0.dot(v1);
  var dot02 = v0.dot(v2);
  var dot11 = v1.dot(v1);
  var dot12 = v1.dot(v2);

  // Compute barycentric coordinates
  var invDenom = 1 / (dot00 * dot11 - dot01 * dot01)
  var u = (dot11 * dot02 - dot01 * dot12) * invDenom
  var v = (dot00 * dot12 - dot01 * dot02) * invDenom

  // Check if point is in triangle
  return (u >= 0) && (v >= 0) && (u + v < 1)
}

Triangle.isConcave = function(a,b,c){
  //rotate the points around B to make B and A parrallel to the X axis
  //If the line BC is negative, it is Concave
  //If the line BC is positive, it is Convex

  var BAhyp = a.dist(b);
  var BAopp = a.y - b.y;

  var BArotate = Math.asin(BAopp/BAhyp);
  var Cnew = c.rotate(c,-BArotate);

  BCadj = Cnew.x - b.x;
  BCopp = Cnew.y - b.y;
  return BCopp < 0;
}

module.exports = Triangle;
