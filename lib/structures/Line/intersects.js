var Vec2 = require("../Vec2");
var Line = {};

Line.intersectsLine = function(lineB){
  var lineA = this;
  if(lineA.slope.equals(lineB.slope)) return false;

  var intersect = new Vec2();
  //lineA should take care of any special conditions
  if(lineA.slope.x === 0 || lineB.slope.x === 0){
    if(lineA.slope.y === 0 || lineB.slope.y === 0){
      return new Vec2(
        (lineA.slope.x === 0)?lineA.xint:lineB.xint,
        (lineA.slope.y === 0)?lineA.yint:lineB.yint
      );
    }
    //I don't care which one is which 0
    //calculate in respect to X
    intersect.y = (lineA.xint-lineB.xint)/(lineB.inv_slope-lineA.inv_slope);
    intersect.x = lineA.inv_slope*intersect.y + lineA.xint;
  }else{
    intersect.x = (lineA.yint-lineB.yint)/(lineB.true_slope-lineA.true_slope);
    intersect.y = lineA.true_slope*intersect.x + lineA.yint;
  }
  return intersect;
};

Line.intersectsLineSegment = function(line){
  var intersect = this.intersectsLine(line);
  if(!intersect) return false;
  if(!(new Vec2().posinf().min(this.A).min(this.B).max(intersect).equals(intersect)))
    return false;
  if(!(new Vec2().neginf().max(this.A).max(this.B).min(intersect).equals(intersect)))
    return false;
  if(!(new Vec2().posinf().min(line.A).min(line.B).max(intersect).equals(intersect)))
    return false;
  if(!(new Vec2().neginf().max(line.A).max(line.B).min(intersect).equals(intersect)))
    return false;
  return intersect;
};

Line.pointIsLeftOrTop = function(p){
  //get slopes of the lines
  //see if a ray cast from 0,0 intersects it
  return this.B.clone().sub(this.A).cross(p.clone().sub(this.A)) < 0;
};

Line.intersectsPoint = function(p){
  if(!this.slope.x) return this.xint == p.x;
  return p.y == p.x*this.slope.slope() + this.yint;
};


Line.segmentIntersectsPoint = function(p){
  if(this.max.y < p.y) return false;
  if(this.min.y > p.y) return false;
  if(this.max.x < p.x) return false;
  if(this.min.x > p.x) return false;
  return this.intersectsPoint(p);
};
module.exports = Line;
