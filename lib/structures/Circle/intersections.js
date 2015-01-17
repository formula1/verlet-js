var Line = require("../Line");
var Vec2 = require("../Vec2");
var Circle = {};

Circle.intersectsCircle = function(circle){
  var line = this.midpoint.dist(circle.midpoint);
  var leftovers = this.radius+circle.radius - line;
  if( leftovers < 0) return false;
  console.log(this.midpoint.clone().mid(circle.midpoint));
  if(leftovers <= 0.1) return [this.midpoint.clone().mid(circle.midpoint)]

  var slope = circle.midpoint.clone().sub(this.midpoint).normalize();
  var pointA = slope.clone().scale(this.radius-leftovers).add(this.midpoint);
  var pointB = slope.clone().scale(-circle.radius+leftovers).add(circle.midpoint);
  if(pointA.equals(pointB)) return [pointA];

  return this.intersectsLine(new Line(pointA,pointB).perpendicularBisector());
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
