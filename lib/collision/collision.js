var AABB = require("../structures/AABB");
var Line = require("../structures/Line");
var boxIntersect = require("box-intersect");
var Time = require("./time");
var Momentum = require("./momentum");


function toExport(composites,step){
  var l = composites.length;
  var aabbs = new Array(l);
  while(l--){
    aabbs[l] = composites[l].aabb.toArray();
  }
  var intersects = boxIntersect(aabbs);
  if(!(l = intersects.length)) return;
  while(l--){
    handleSuspects(
      composites[intersects[l][0]],
      composites[intersects[l][1]],
      step
    );
  }
}

function handleSuspects(compositeA, compositeB, timestep){
  var l, ll, i;

  var manifold = compositeA.aabb.sub(compositeB.aabb);

  var suspectsA = manifold.getSuspects(compositeA.particles);
  var suspectsB = manifold.getSuspects(compositeB.particles);
  if(suspectsA.lines.length === 0 || suspectsB.lines.length === 0){
    return false;
  }
  if(suspectsA.inside.length === 0 && suspectsB.inside.length === 0){
    return false;
  }
  l = suspectsA.inside.length;
  while(l--){
    ll = suspectsB.lines.length;
    while(ll--){
      runCollision(
        compositeA.particles[suspectsA.inside[l]], //the point
        compositeB.particles[suspectsB.lines[ll][0]], //a of the line
        compositeB.particles[suspectsB.lines[ll][1]],  //b of the line
        timestep
      );
    }
  }
  l = suspectsB.inside.length;
  while(l--){
    ll = suspectsA.lines.length;
    while(ll--){
      runCollision(
        compositeB.particles[suspectsB.inside[l]], //the point
        compositeA.particles[suspectsA.lines[ll][0]], //a of the line
        compositeA.particles[suspectsA.lines[ll][1]],  //b of the line
        timestep
      );
    }
  }
  // console.log("collision solved");
}




function runCollision(p,a,b,timestep){

  //this finds the time difference in which they first intersect
  var res = Time.getImpacts(p, a, b);
  if(!res) return false;
  res = Time.restrict(res,timestep);
  if(!res) return false;

  res /= timestep;

  Momentum.distributeVelocities(p,a,b,res);
}



module.exports = toExport;
