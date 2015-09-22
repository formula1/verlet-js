var __lib = '../../lib';
var Particle = require(__lib+"/structures/Particle");
var Composite = require(__lib+"/structures/Composite");
var Vec2 = require(__lib+"/structures/Vec2");
var suspectFinder = require(__lib+"/collision");

var assert = function(label, expression) {
  console.log("Susepect(" + label + "): " + (expression === true ? "PASS" : "FAIL"));
  if (expression !== true) throw "assertion failed";
};

var PI2 = Math.PI*2;

var nonMoving;

function resetNonMoving(){
  nonMoving = new Composite();
  repeatCircle(10,12,function(angle,pos){
    nonMoving.particles.push(new Particle(pos));
    nonMoving.aabb.digestPoint(pos);
  });
}

repeatCircle(15,12,function(angleToOther,midpoint){
  resetNonMoving();
  var tempCircle = new Composite();
  repeatCircle(10,12,function(angle,pos){
    var p = new Particle(pos.add(midpoint));
    p.vel.set(Math.cos(angleToOther),Math.sin(angleToOther)).mul(-1);
    tempCircle.particles.push(p);
    tempCircle.aabb.digestPoint(p.pos);
  });
  var manifold = nonMoving.aabb.sub(tempCircle.aabb);
  var suspects = suspectFinder.getSuspectPoints(nonMoving, tempCircle, 5);
  assert('Have suspects', !!suspects);
  assert('Suspect.A Line length > 0', suspects.A.lines.length > 0);
  assert('Suspect.A Point length > 0', suspects.A.inside.length > 0);
  assert('Suspect.B Line length > 0', suspects.B.lines.length > 0);
  assert('Suspect.B Point length > 0', suspects.B.inside.length > 0);
  var step = 500;
  suspects.A.inside.forEach(function(point){
    var found = false;
    suspects.B.lines.forEach(function(line){
      var time;
      if(pointInCircle(point.pos,midpoint,10)){
        if(found) return;
        time = suspectFinder.getTimeOfImpact(point, line[0], line[1], step);
        if(time === false) return;
        found = suspectFinder.pointWithinSegment(point, line[0], line[1], time);
      }else{
        found = found || !!suspectFinder.getTimeOfImpact(point, line[0], line[1], step) ||
                suspectFinder.pointWithinSegment(point, line[0], line[1], time);
      }
    });
    if(pointInCircle(point.pos,midpoint,10)){
      assert('An Impact Happened',found);
    }else{
      assert('An Impact Did not Happen',found);
    }

  });
});

function repeatCircle(radius,segments,fn){
  var interval = PI2/segments;
  for(var i=0;i<PI2;i+=interval){
    fn(i,new Vec2(Math.cos(i)*radius, Math.sin(i)*radius));
  }
}

function pointInCircle(point, midpoint, radius){
  return point.dist(midpoint) < radius;
}


