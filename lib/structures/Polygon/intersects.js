var AABB = require("../AABB")
var Line = require("../Line");
var Polygon = {};

Polygon.intersectsLine = function(line,skip){
  //creating smaller aabbs
  //We're going to detect intersection by slope
  //however, the point of intersection may be outside of the of the possible area
  //as a result we're creating a smaller aabb thats the maxes and minimums of the current area

  var tAABB = new AABB(line.A,line.B);

  var intersections = [];

  this.forThree(function(oprev,ocurr,onext){
    if(line.A == ocurr) return;
    if(line.B == oprev) return;
    if(oprev == line.A) return;
    var oAABB = new AABB(oprev,ocurr);

    if(!tAABB.intersectsAABB(oAABB)) return;

    //I would like to cache the oprev->ocurr line if possible
    //I would also prefer searching only for lines with the appropiate AABBs
    var intersect = line.intersectsLine(new Line(oprev,ocurr));
    if(!intersect) return;

    var netAABB = {
      max: oAABB.max.min(tAABB.max),
      min: oAABB.min.max(tAABB.min)
    };
    //If intersect point isn't between the two points, this isn't for us.
    if(!tAABB.containsPoint(intersect)) return;

    intersections.push(intersect);

  },skip);
  return intersections;
}
module.exports = Polygon;
