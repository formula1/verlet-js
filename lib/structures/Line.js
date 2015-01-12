var Vec2 = require("./Vec2");


function Line(slope,intercept,boo){
  if(typeof arguments[0] == "number" && typeof arguments[1] == "number"){
    if(boo){
      this.inv_slope = slope;
      this.xint = intercept
      this.true_slope = 1/this.inv_slope;
      this.yint = -this.true_slope*this.xint;
    }else{
      this.true_slope = slope;
      this.yint = intercept
      this.inv_slope = 1/this.true_slope;
      this.xint = -this.inv_slope*this.yint;
    }
    this.limits = [new Vec2(0,yint),new Vec2(0,xint)];
    this.slope = this.limits[0].clone().sub(this.limits[1]);
    return;
  }
  var args = Vec2.overloadArguments(
    arguments,
    Line.lengthTest
  );
  if(args[0].equals(args[1])){
    throw new Error("Cannot create a line from equivalent values");
  }

  this.limits = [args[0], args[1]];
  this.mid = args[0].clone().add(args[1]).scale(1/2);
  this.slope = args[0].clone().sub(args[1]);
  this.inv_slope = (this.slope.y == 0)?false:this.slope.x/this.slope.y;
  this.true_slope = (this.slope.x == 0)?false:this.slope.y/this.slope.x;
  this.yint = -this.true_slope*args[0].x + args[0].y
  this.xint = -this.inv_slope*args[0].y + args[0].x
}

Line.prototype.length = function(){
  return this.limits[0].dist(this.limits[1]);
}

Line.prototype.getPerpendicularBisect = function(){
  var yint = -this.inv_slope*mid.x + mid.y;
  return new Line(this.inv_slope, yint);
}

Line.prototype.opposite = function(){
  return this.limits[1].y - this.limits[0].y;
}

Line.prototype.adjacent = function(){
  return this.limits[1].x - this.limits[0].x;
}


Line.prototype.getIntersection = function(B1,B2){

  var lineB = (B1 instanceof Line)?B1:new Line(B1,B2);

  // unlikely
  if(this.slope.equals(lineB.slope)) return false;

  var intersect = new Vec2();
  //This should take care of any special conditions
  if(this.slope.x === 0 || lineB.slope.x === 0){
    if(this.slope.x == lineB.slope.x) return false;
    if(this.slope.y === 0 || lineB.slope.y === 0){
      return new Vec2(
        (this.slope.x === 0)?this.xint:lineB.xint,
        (this.slope.y === 0)?this.yint:lineB.yint
      );
    }

    //I don't care which one is which
    var true_slope_A = this.inv_slope;
    var true_slope_B = lineB.inv_slope;
    //calculate in respect to X
    var bA = this.xint;
    var bB = lineB.xint;
    intersect.y = (bA-bB)/(true_slope_B-true_slope_A);
    intersect.x = true_slope_A*intersect.y + bA;
  }else{
    var true_slope_A = this.true_slope;
    var true_slope_B = lineB.true_slope;
    if(true_slope_A == true_slope_B) return false;
    var bA = this.yint;
    var bB = lineB.yint;
    intersect.x = (bA-bB)/(true_slope_B-true_slope_A);
    intersect.y = true_slope_A*intersect.x + bA;
  }
  return intersect;

}

Line.lengthTest = function(length){
  return (length == 2)?2:false;
}

Line.getIntersection = function(A1,A2,B1,B2){
  var slopeA = A1.clone().sub(A2);
  var slopeB = B1.clone().sub(B2);

  // unlikely
  if(slopeA.equals(slopeB)) return false;

  var intersect = new Vec2();
  //This should take care of any special conditions
  if(slopeA.x == 0 || slopeB.x == 0){
    if(slopeA.x == slopeB.x) return false;
    if(slopeA.y == 0 || slopeB.y == 0){
      return new Vec2(
        (slopeA.x == 0)?A1.x:B1.x,
        (slopeA.y == 0)?A1.y:B1.y
      );
    }

    //I don't care which one is which
    var true_slope_A = slopeA.x/slopeA.y;
    var true_slope_B = slopeB.x/slopeB.y;
    //calculate in respect to X
    var bA = -true_slope_A*A1.y + A1.x;
    var bB = -true_slope_B*B1.y + B1.x;
    intersect.y = (bA-bB)/(true_slope_B-true_slope_A);
    intersect.x = true_slope_A*intersect.y + bA;
  }else{
    var true_slope_A = slopeA.y/slopeA.x;
    var true_slope_B = slopeB.y/slopeB.x;
    if(true_slope_A == true_slope_B) return false;
    var bA = -true_slope_A*A1.x + A1.y;
    var bB = -true_slope_B*B1.x + B1.y;
    intersect.x = (bA-bB)/(true_slope_B-true_slope_A);
    intersect.y = true_slope_A*intersect.x + bA;
  }
  return intersect;

}

module.exports = Line;
