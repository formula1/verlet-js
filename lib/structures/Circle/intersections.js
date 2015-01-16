var Line = require("../Line");
var Vec2 = require("../Vec2");
var Circle = {};

Circle.intersectsCircle = function(circle){
  //http://stackoverflow.com/questions/12219802/a-javascript-function-that-returns-the-x-y-points-of-intersection-between-two-ci
  //because my custom code wouldn't produce correct results : /
  console.log(this)
  console.log(circle)
  var c1r = this.radius;
  var c2r = circle.radius;
  //Calculate distance between centres of circle
  var d =this.midpoint.dist(circle.midpoint);
  var m = c1r + c2r;
  var n = c1r - c2r;

  if (n < 0) n = n * -1;
  //No solns
  if ( d > m )
    return false;
  //Circle are contained within each other
  if ( d < n )
    return false;
  //Circles are the same
  if ( d == 0 && c1r == c2r )
    return true;
  //Solve for a
  var a = ( c1r * c1r - c2r * c2r + d * d ) / (2 * d);
console.log(a);
console.log(c2r);
//Solve for h
  var h = Math.sqrt( c1r * c1r - a * a );

  var middiff = circle.midpoint.clone().sub(this.midpoint);
  //Calculate point p, where the line through the circle intersection points crosses the line between the circle centers.
  var p = this.midpoint.clone().scale(a/d).mul(middiff);

  //1 soln , circles are touching
  if ( d == c1r + c2r ) {
    return [p];
  }
  middiff.swap().scale(h/d);
  //2solns
  var p1 = p.clone().add(new Vec2(1,-1).mul(middiff));
  var p2 = p.clone().add(new Vec2(-1,1).mul(middiff));;

  return [p1,p2];
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
