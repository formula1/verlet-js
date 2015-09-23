var AABB = require("../structures/AABB");
var Line = require("../structures/Line");
var boxIntersect = require("box-intersect");
var Time = require("./time");
var Momentum = require("./momentum");

module.exports = checkForCollisions;
module.exports.getSuspectPoints = getSuspectPoints;
module.exports.checkForImpact = checkForImpact;
module.exports.getTimeOfImpact = getTimeOfImpact;
module.exports.pointWithinSegment = pointWithinSegment;

/*

Get All Intersections of AABBs
For Each of the Intersections
  -get suspect points and lines of the AABBs assocaited to the intersection
    -For each of the suspect points and lines, find all collisions that are made

Sort the collisions by time
for Each collision
  -Resolve the collision
  -Re do Collision checking for
    - That point
    - The point's lines
    - The line that collided with the point
    - The line's points
  -Check if the other collisions involved with the point and lines are still valid
*/


function checkForCollisions(composites,step){
  var col;
  while(step > 0){
    console.log(step);
    var earlytime = Number.POSITIVE_INFINITY;
    var collisions;
    var l = composites.length;
    while(l--){
      var ll = l;
      var suspects = getSuspectPoints(composites[l],composites[l]);
      if(suspects){
        col = findEarliestCollision(suspects.A.inside,suspects.B.lines,step);
        if(col.time < earlytime){
          earlytime = col.time;
          collisions = [col];
        }else if(col.time === earlytime && earlytime < Number.POSITIVE_INFINITY){
          collisions.push(col);
        }
      }
      while(ll--){
        if(!composites[l].aabb.intersectsAABB(composites[ll].aabb)) continue;
        suspects = getSuspectPoints(composites[l],composites[ll]);
        if(!suspects) continue;
        col = findEarliestCollision(suspects.A.inside,suspects.B.lines,step);
        if(col.time < earlytime){
          earlytime = col.time;
          collisions = [col];
        }else if(col.time === earlytime && earlytime < Number.POSITIVE_INFINITY){
          collisions.push(col);
        }
        col = findEarliestCollision(suspects.B.inside,suspects.A.lines,step);
        if(col.time < earlytime){
          earlytime = col.time;
          collisions = [col];
        }else if(col.time === earlytime && earlytime < Number.POSITIVE_INFINITY){
          collisions.push(col);
        }
      }
    }
    if(earlytime === Number.POSITIVE_INFINITY) break;
    console.log('distributing');
    var points = [];
    while(collisions.length){
      col = collisions.pop();
      if(points.indexOf(col.point) !== -1 && (
        points.indexOf(col.line[0]) !== -1||
        points.indexOf(col.line[1]) !== -1
      )) continue;
      Momentum.distributeVelocities(
        col.point,
        col.line[0],
        col.line[1],
        col.time
      );
      points.push(col.point, col.line[0], col.line[1]);
    }
    step = -earlytime;
  }
}

function getSuspectPoints(compositeA, compositeB){
  var manifold = compositeA.aabb.clone().sub(compositeB.aabb);

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

function findEarliestCollision(points,lines,timestep){
  var l, ll;
  l = points.length;
  var col, p, a, b, tempTime;
  var earliest = {time:Number.POSITIVE_INFINITY};
  while(l--){
    p = points[l];
    ll = lines.length;
    while(ll--){
      var line = lines[ll];
      a = line[0];
      b = line[1];
      tempTime = getTimeOfImpact(p,a,b,timestep);
      if(tempTime === false) continue;
      console.log("temptime",tempTime);
      if(tempTime > earliest.time) continue;
      if(!pointWithinSegment(p,a,b,tempTime)) continue;
      earliest.time = tempTime;
      earliest.line=line;
      earliest.point = p;
    }
  }
  return earliest;
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

  return new Line(a,b).segmentIntersectsPoint(p);
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
