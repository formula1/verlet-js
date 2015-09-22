var Vel = require("./velocities.js");
var Material = require("./material.js");




function getTransform(p,lp,slope){
  var e = (p.elasticity+lp.elasticity)/2;
  var netvel = p.vel.clone().mul(p.mass).add(lp.vel.clone().mul(lp.mass));
  netvel.div(p.mass+lp.mass);
  return netvel;
  /*
  //Thank you http://www.euclideanspace.com/physics/dynamics/collision/twod/
  //Well, you didn't quite work out
  var ni = (1+e)*(p.mass*lp.mass)/(p.mass + lp.mass);
  ni = slope.mul(p.vel.clone().sub(lp.vel).dot(slope)).mul(ni);

  console.log(p,lp);
  console.log(ni.clone().div(p.mass));
  console.log(ni.clone().div(lp.mass));
  p.vel.sub(ni.clone().div(p.mass));
  lp.vel.sub(ni.clone().div(lp.mass));
  console.log(ni);
  console.log(p,lp);
  */
}

function distributeVelocities(p,a,b,time){
//  var vels = Vel.getVelocities(a,b,time);
// We reset the position to the moment the collision initially happened
  a.pos.add(a.vel.clone().scale(time));
  b.pos.add(b.vel.clone().scale(time));
  p.pos.add(p.vel.clone().scale(time));
  p.mass= Material.getParticleMass(p);
  p.elasticity = Material.getParticleElasticity(p);

// A and B create a line, we want the Velocity on the line at point P
  var net_velocity = Vel.getVelocityAtPoint(a,b,p);

  var lp = {
    pos:  p.pos.clone(),
    vel:  Vel.getVelocityAtPoint(a,b,p),
    mass: Material.getMassAtPoint(a,b,p),
    elasticity: Material.getElasticityAtPoint(a,b,p)
  };
  var dir = getDirection(a,b,p,time);
//  console.log(dir);

  var transform = getTransform(p,lp,dir);

  p.vel.set(transform);
  var oldvel = lp.vel.clone();
  lp.vel.set(transform);
  transform.sub(oldvel);


  Vel.applyTransformAtPoint(a,b,lp,transform);
  a.pos.sub(a.vel.clone().scale(time));
  b.pos.sub(b.vel.clone().scale(time));
  p.pos.sub(p.vel.clone().scale(time));

//  console.log(a,b,p);

}

function getDirection(a,b,p,time){
  var dir = a.pos.clone().sub(b.pos).swap();
  var op = p.pos.clone().sub(b.pos).sub(p.vel.clone());
  if(dir.mul(-1,1).dist(op) > dir.mul(-1,-1).dist(op)){
    return dir.normalize();
  }
  return dir.mul(-1,-1).normalize();
}

module.exports.distributeVelocities = distributeVelocities;
