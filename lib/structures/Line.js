

function Line(points){

  if(arguments.length > 2) throw new Error("can only accept 2 or less arguments");
  if(arguments.length == 2){
    points = Array.prototype.slice.call(arguments,0);
  }else if(arguments.length == 1){
    if(!Array.isArray(points)){
      throw new Error("If you are only providing a single Argument, it must be an array");
    }
  }else{
    throw new Error("When constructing a line, must have 2 points");
  }
  this.slope = points[0].pos.sub(points[1].pos);
  this.inv_slope = (this.slope.y == 0)?false:this.slope.x/this.slope.y;
  this.true_slope = (this.slope.x == 0)?false:this.slope.y/this.slope.x;
  this.yint = -this.true_slope*points[0].x + points[0].y
  this.xint = -this.inv_slope*points[0].y + points[0].x
}

Line.prototype.getIntersection = function(B1,B2){
  var slopeB = B1.pos.sub(B2.pos);

  // unlikely
  if(this.slope.equals(slopeB)) return false;

  var intersect = new Vec2();
  //This should take care of any special conditions
  if(this.slope.x === 0 || slopeB.x === 0){
    if(this.slope.x == slopeB.x) return false;
    if(this.slope.y === 0 || slopeB.y === 0){
      return new Vec2(
        (this.slope.x === 0)?this.xint:B1.x,
        (this.slope.y === 0)?this.yint:B1.y
      );
    }

    //I don't care which one is which
    var true_slope_A = this.inv_slope;
    var true_slope_B = slopeB.x/slopeB.y;
    //calculate in respect to X
    var bA = this.xint;
    var bB = -true_slope_B*B1.y + B1.x;
    intersect.y = (bA-bB)/(true_slope_B-true_slope_A);
    intersect.x = true_slope_A*intersect.y + bA;
  }else{
    var true_slope_A = this.true_slope;
    var true_slope_B = slopeB.y/slopeB.x;
    if(true_slope_A == true_slope_B) return false;
    var bA = this.yint;
    var bB = -true_slope_B*B1.x + B1.y;
    intersect.x = (bA-bB)/(true_slope_B-true_slope_A);
    intersect.y = true_slope_A*intersect.x + bA;
  }
  return intersect;

}


Line.getIntersection = function(A1,A2,B1,B2){
  var slopeA = A1.pos.sub(A2.pos);
  var slopeB = B1.pos.sub(B2.pos);

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
