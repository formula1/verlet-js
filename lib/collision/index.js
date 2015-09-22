var AABB = require("../structures/AABB");
var Line = require("../structures/Line");
var boxIntersect = require("box-intersect");
var Time = require("./time");
var Momentum = require("./momentum");
var binaryOps = require('formula1-array-util');

module.exports = checkForCollisions;
module.exports.getSuspectPoints = getSuspectPoints;
module.exports.insertCollisions = insertCollisions;
module.exports.checkForImpact = checkForImpact;
module.exports.getTimeOfImpact = getTimeOfImpact;
module.exports.pointWithinSegment = pointWithinSegment;

function checkForCollisions(composites,step){
  var l = composites.length;
  var aabbs = new Array(l);
  while(l--){
    aabbs[l] = composites[l].aabb.toArray();
  }
  var intersects = boxIntersect(aabbs);
  if(!(l = intersects.length)) return;
  var collisions = [];
  while(l--){
    var suspects = getSuspectPoints(
      composites[intersects[l][0]],
      composites[intersects[l][1]]
    );
    if(!suspects) continue;
    insertCollisions(suspects.A.inside,suspects.B.lines,step,collisions);
    insertCollisions(suspects.B.inside,suspects.A.lines,step,collisions);
  }

  resolveCollisions(collisions, step);
}

function getSuspectPoints(compositeA, compositeB){
  var manifold = compositeA.aabb.sub(compositeB.aabb);

  var suspectsA = manifold.getSuspects(compositeA.particles);
  var suspectsB = manifold.getSuspects(compositeB.particles);
  if(suspectsA.lines.length === 0 || suspectsB.lines.length === 0){
    return false;
  }
  if(suspectsA.inside.length === 0 && suspectsB.inside.length === 0){
    return false;
  }
  // Its possible to iterate as we get one, I should look into Lazy.js more heavilly
  // Generally the way it would work is...
  // We get a point!
    // We then check that point onto all available lines
    // We add the lines for it!
      // We then check those lines on all available points
  // There are cases however when there is a single intersection that allows multiple points inside
  return {A:suspectsA,B:suspectsB};
}

function insertCollisions(points,lines,timestep,collisions){
  var l, ll;
  l = points.length;
  // I'm not sure why I'm not looking for first impact and then resolving
  // In fact I should be finding first impact, resolving that, then iterating again
  // The reason for this is...
  // 1) In the case where three objects are colliding
  // 2) In case the result of a collision will cause a collision into another object
  // 3) When accelleration becomes a factor resolved between time steps
  var col, p, a, b, tempTime;
  while(l--){
    p = points[l];
    ll = lines.length;
    col = {time:Number.POSITIVE_INFINITY,point:p};
    while(ll--){
      var line = lines[ll];
      a = line[0];
      b = line[1];
      tempTime = getTimeOfImpact(p,a,b,timestep);
      if(tempTime === false) continue;
      if(tempTime === 0) continue;
      if(tempTime > col.time) continue;
      if(!pointWithinSegment(p,a,b,tempTime)) continue;
      col.time = tempTime;
      col.line=line;
    }
    if(col.time === Number.POSITIVE_INFINITY) continue;
    binaryOps.insert(collisions,col,compareTimes);
  }
}

function resolveCollisions(collisions, timestep){
  //collisions is expected to be a sorted list
  var tempTime;
  while(collisions.length){
    var col = collisions.pop();
    if(col.line.modified){
      var p = col.point;
      var a = col.line[0];
      var b = col.line[1];
      tempTime = getTimeOfImpact(p,a,b,timestep);
      if(tempTime === false) continue;
      if(tempTime === 0) continue;
      if(!pointWithinSegment(p,a,b,tempTime)) continue;
      if(tempTime !== col.time && collisions.length && collisions[0].time < col.time){
        binaryOps.insert(collisions,col,compareTimes);
        continue;
      }
    }
    Momentum.distributeVelocities(col.point,col.line[0],col.line[1],col.time);
    col.line.modified = true;
  }
}

function checkForImpact(p,line,timestep){
  var a = line[0], b = line[1];

  var tempTime = getTimeOfImpact(
    p, //the point
    a, //a of the line
    b,  //b of the line
    timestep
  );
  if(tempTime === false) return false;

  // See I get the "Point" in time that it happened
  // However I need to scale the velocity to it I believe
  // But why do I need it, I don't understand really
  // Its quite possible that I do not need it
  tempTime = tempTime/timestep;
  // I may want to add the actual setting here also do keep things dry
  if(!pointWithinSegment(p,a,b,tempTime)) return false;

  Momentum.distributeVelocities(p,a,b,tempTime);
}

function pointWithinSegment(p,a,b,time){
  //This is pretty important

  a = a.pos.clone().add(a.vel.clone().scale(time));
  b = b.pos.clone().add(b.vel.clone().scale(time));
  p = p.pos.clone().add(p.vel.clone().scale(time));

  return new AABB(a,b).containsPoint(p);
}



function getTimeOfImpact(p,a,b,timestep){

  //this finds the time difference in which they first intersect
  var res = Time.getImpacts(p, a, b);
  if(!res) return false;
  res = Time.restrict(res,timestep);
  if(!res) return false;

  return res;
}

function compareTimes(a,b){
  return b.time - a.time;
}
