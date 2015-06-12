var Vel = require("./velocities.js");


function getMassAtPoint(a,b,p){
//  console.log("need to get the net mass behind the line");
  /*
    This can be based off liquid dynamics
    This can also be based off baseball bats
    This cannot be based off an average mass since the mass is actually the entire line
    We will be doing baseball bat...
  */
  var td = a.pos.dist(b.pos);
  //So the situation is like this
  //The further away p is from the center point
  //-the less mass a single side will have
  //The Closer it is
  //It will make no difference
  var diff = p.pos.dist(a.pos)/td;
  var m = 0;
  m += getParticleMass(a)*(diff > 0.5)?1-diff:1;
  m += getParticleMass(b)*(diff < 0.5?diff:1);
  return m;
}

function getElasticityAtPoint(a,b,p){
//  console.log("need to get the net elasticity on the point");
  var ad = a.pos.dist(p.pos);
  var bd = b.pos.dist(p.pos);
  return getParticleElasticity(a)*bd/(ad+bd) + getParticleElasticity(b) * ad/ (ad+bd);
}


function getParticleMass(p){
//  console.log("need to get the net mass behind the particle");
  return 1;
}

function getParticleElasticity(p){
//  console.log("need to get the net elasticity behind the particle");
  return 0;
}


function collide(p,lp,slope){
  var e = (p.elasticity+lp.elasticity)/2;
  var netvel = p.vel.clone().mul(p.mass).add(lp.vel.clone().mul(lp.mass));
  netvel.div(p.mass+lp.mass);
  p.vel.set(netvel);
  lp.vel.set(netvel);
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

function getLiquidMassAtPoint(p,container){

}

function distributeVelocities(p,a,b,time){
//  var vels = Vel.getVelocities(a,b,time);
  a.pos.add(a.vel.clone().scale(time));
  b.pos.add(b.vel.clone().scale(time));
  p.pos.add(p.vel.clone().scale(time));
  p.mass= getParticleMass(p);
  p.elasticity = getParticleElasticity(p);
  var lp = {
    pos:  p.pos.clone(),
    vel:  Vel.getVelocityAtPoint(a,b,p),
    mass: getMassAtPoint(a,b,p),
    elasticity:getElasticityAtPoint(a,b,p)
  };
  var dir = getDirection(a,b,p,time);
//  console.log(dir);

  collide(p,lp,dir);

  Vel.getVelocitiesFromPoint(a,b,lp);
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
