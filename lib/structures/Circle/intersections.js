var Line = require("../Line");
var Vec2 = require("../Vec2");
var Circle = {};

Circle.intersectsCircle = function(circle){
  //http://www.mathportal.org/calculators/polynomials-solvers/polynomials-expanding-calculator.php

  var xb = this.quadraticX[1] - circle.quadraticX[1];
  var xc = this.quadraticX[2] - circle.quadraticX[2];

  var yb = this.quadraticY[1] - circle.quadraticY[1];
  var yc = this.quadraticY[2] - circle.quadraticY[2];

  var rd = -this.radius*this.radius + circle.radius*circle.radius;
  var offset = xc + yc + rd;

  var fa;
  var fb;
  var fc;
  if(yb == 0 && xb == 0) return true;
  if(yb == 0){ // need to solve for X
    console.log("no y");
    var x = -offset/xb;
    //expanded = yb^2 * y^2 / xb^2 + 2*yb*y*offset/xb^2  + offset^2/yb^2
    var xb2 = xb*xb;

    fa = 1; //+ yb*yb /xb2;
    fb = this.quadraticY[1]; //+ 2*yb*offset /xb2;
    fc = this.quadraticY[2] + Math.pow(x - this.midpoint.x, 2);
    var cords = Math.quadratic(fa,fb,fc);
    if(!cords) return false;
    var l = cords.length;
    //x = -(y*yb + offset)/xb
    //(-x*xb - offset)/yb = y
    while(l--){
      cords[l] = new Vec2(x, cords[l]);
    }
    return cords;
  }else if(xb == 0){ // need to solve for Y
    console.log("no x");
    var y = -offset/yb;
    //expanded = yb^2 * y^2 / xb^2 + 2*yb*y*offset/xb^2  + offset^2/yb^2
    var yb2 = yb*yb;

    fa = 1; //+ yb*yb /xb2;
    fb = this.quadraticX[1]; //+ 2*yb*offset /xb2;
    fc = this.quadraticX[2] + Math.pow(y - this.midpoint.y, 2);
    var cords = Math.quadratic(fa,fb,fc);
    if(!cords) return false;
    var l = cords.length;
    //x = -(y*yb + offset)/xb
    //(-x*xb - offset)/yb = y
    while(l--){
      cords[l] = new Vec2(cords[l], y);
    }
    return cords;
  }
  //will solve for Y
  //equation = y = (-(x*xb + offset)/yb)^2
  //expanded = xb^2 * x^2 / yb^2 + 2*xb*x*offset/yb^2  + offset^2/yb^2
  var yb2 = yb*yb;
  fa = 1 + (xb*xb /yb2);
  fb = this.quadraticX[1] + 2*xb*offset /yb2;
  fc = this.quadraticX[2] + offset*offset / yb2;
  console.log(fa);
  console.log(fb);
  console.log(fc);
  var cords = Math.quadratic(fa,fb,fc);
  if(!cords) return false;
  while(l--){
    cords[l] = new Vec2(cords[l], -(cords[l]*xb+offset)/yb);
  }
  return cords;
}

Circle.intersectsLine = function(line){
  /*
    x2−2x*m.x+m.x2+y2-2y*m.y+m.y2 - r2
    -  mx + b - y
    = intersects
  */
  var midpoint = this.midpoint;
  var r = this.radius;
  //http://mathworld.wolfram.com/Circle-LineIntersection.html
  var t1 = line.A.clone().sub(midpoint);
  var t2 = line.B.clone().sub(midpoint);
  var t =  t1.clone().sub(t2);
  var lr = t.length2();
  var cr = t1.cross(t2);
  var lx = t.x;
  var ly = t.y;

  var delta = r*r*lr - cr*cr;
  // no intersection
  if(delta < 0) return false;
  // tangent line
  if(delta == 0) return [new Vec2( cr*ly/lr, cr*lx/lr ).add(midpoint)];
  //reduce calculations
  delta = Math.sqrt(delta);
  var crly = cr*ly;
  var crlx = -cr*lx;
  var sigdel = Math.sign(ly)*lx * delta;
  var absdel = Math.abs(ly) * delta;
  return [
      new Vec2( (crly + sigdel) / lr, (crlx + absdel) / lr).add(midpoint),
    new Vec2( (crly - sigdel) / lr, (crlx - absdel) / lr).add(midpoint)
  ];
}

Circle.containsPoint = function(point){
  return this.midpoint.dist(point) < this.radius;
}

Circle.intersectsPoint = function(point){
  return this.midpoint.dist(point) == this.radius;
}


module.exports = Circle;
