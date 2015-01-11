var Vec2 = require("./Vec2");

function Circle(midpoint, radius){
  var args;
  if(typeof radius == "number"){
    this.radius = radius;
    this.midpoint = Vec2.overloaded(midpoint);
    return;
  }
  args = Vec2.overloadArguments(
    arguments,
    Circle.lengthTest
  );
  if(args.length == 2){
    this.midpoint = args[0].add(args[1]).scale(1/2);
    this.radius = args[0].dist(args[1])/2;
  }else if(args.length == 3){
    var pbAB = (new Line(args[0], args[1])).getPerpendicularBisect();
    var pbCB = (new Line(args[2], args[1])).getPerpendicularBisect();
    this.midpoint = pbAB.getIntersection(pbCB);
    this.radius = args[0].dist(this.midpoint);
  }else{
    throw new Error("can only construct a Circle from 2 or 3 points or midpoint and radius");
  }

}

Circle.prototype.containsPoint = function(point){
  return this.midpoint.dist(point.pos) < radius;
}

Circle.prototype.hasPoint = function(){
  return this.midpoint.dist(point.pos) == radius;
}

Circle.prototype.getLineIntersection = function(line){
  //http://mathworld.wolfram.com/Circle-LineIntersection.html
  var lx = -line.xint.x;
  var ly = line.yint.y;
  var lr = Math.sqrt(ly*ly + lx+lx);
  cr = line.xint.cross(line.yint); //line.xint.x*line.yint.y + 0*0

  var r = this.radius

  var delta = r*r*dr*dr - cr*cr;
  if(delta < 0) return false;
  lr = lr*lr; //reduce calculations
  if(delta == 0){
    return [new Vec2(
      cr*ly/lr,
      -cr*lx/lr
    )];
  }
  //reduce calculations
  delta = Math.sqrt(delta);
  var crly = cr*ly;
  var crlx = -cr*lx;
  var sigdel = Math.sig(ly)*lx * delta;
  var absdel = Math.abs(ly) * delta;
  return [
    new Vec2(
      (crly + sigdel) / lr
      (crlx + absdel) / lr
    ),
    new Vec2(
      (crly - sigdel) / lr
      (crlx - absdel) / lr
    )
  ]
}

Circle.lengthTest = function(length){
  return (length == 2 || length == 3)?length:false;
}

module.exports = Circle;
