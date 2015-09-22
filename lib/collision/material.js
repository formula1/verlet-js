

function getParticleMass(p){
//  console.log("need to get the net mass behind the particle");
  return 1;
}
module.exports.getParticleMass = getParticleMass;

function getParticleElasticity(p){
//  console.log("need to get the net elasticity behind the particle");
  return 0;
}
module.exports.getParticleElasticity = getParticleElasticity;

module.exports.getElasticityAtPoint = function (a,b,p){
//  console.log("need to get the net elasticity on the point");
  var ad = a.pos.dist(p.pos);
  var bd = b.pos.dist(p.pos);
  return getParticleElasticity(a) * bd/(ad+bd) + getParticleElasticity(b) * ad/(ad+bd);
};


module.exports.getMassAtPoint = function(a,b,p){
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
};
