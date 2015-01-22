var Line = {};

Line.angledSlope = function(){
  return this.A.clone().sub(this.B).normalize();
}
Line.slope = function(){
  return this.angledSlope.scale(
    Math.sign(this.angledSlope.x)||Math.sign(this.angledSlope.y)
  );
};
Line.inv_slope = function(){
  return (this.slope.y == 0)?false:this.slope.x/this.slope.y;
}
Line.true_slope = function(){
  return (this.slope.x == 0)?false:this.slope.y/this.slope.x;
}
Line.yint = function(){
  return (this.true_slope !== false)?-this.true_slope*this.A.x + this.A.y:false;
}
Line.xint = function(){
  return (this.inv_slope !== false)?-this.inv_slope*this.A.y + this.A.x:false;
}
Line.mid = function(){
  return this.A.clone().mid(this.B);
};
Line.length2 = function(){
  return this.A.dist2(this.B);
}
Line.length = function(){
  return Math.sqrt(this.length2);
}
Line.cross = function(){
  return this.A.cross(this.B);
}


Line.opposite = function(){
  return this.B.y - this.A.y;
}

Line.adjacent = function(){
  return this.B.x - this.A.x;
}

module.exports = Line;
