
function getLineMass(){
  console.log("need to get the net mass behind the line");
  return 2;
}

function getParticleMass(){
  console.log("need to get the net mass behind the particle");
  return 1;
}

function inelastic(){

}

function elastic(){

}

function getLiquidMassAtPoint(p,container){

}

function distributeVelocities(p,a,b,time){
  a.pos.add(a.vel.clone().scale(time));
  b.pos.add(b.vel.clone().scale(time));
  p.pos.add(p.vel.clone().scale(time));




  //I'm now finding the net velocity of the line at that point
  var ab = a.pos.dist(b.pos);
  var ap = a.pos.dist(p.pos);
  var bp = b.pos.dist(p.pos);
  //  console.log("ap: "+(ap/ab));
  //  console.log("bp: "+(bp/ab));
/*
  alert(
    "LineA{vel:"+a.vel+", pos:"+a.pos+"}\n"+
    "LineB{vel:"+b.vel+", pos:"+b.pos+"}\n"+
    "particle{vel:"+p.vel+", pos:"+p.pos+"}"
  );
  */
  var netv = a.vel.clone().scale(bp/ab).add(b.vel.clone().scale(ap/ab));
  //  console.log("avel: "+a.vel);
  //  console.log("bvel: "+b.vel);

  //  console.log(p.pos);

  //  console.log("netv: "+netv);
  //now distributing momentum
  p.vel.set(new Vec2(0,0));
  a.vel.set(new Vec2(0,0));
  b.vel.set(new Vec2(0,0));
/*
  netv.scale(getLineMass())
  .add(p.vel.clone().scale(getParticleMass()))
  .scale(1/(getLineMass()+getParticleMass()));

  p.vel.set(netv);
  //  console.log("netv`: "+netv);
  a.vel.scale(ap/ab).add(p.vel.clone().scale(bp/ab));
  b.vel.scale(bp/ab).add(p.vel.clone().scale(ap/ab));

  //  console.log("avel`: "+a.vel);
  //  console.log("bvel`: "+b.vel);

  //now configuring new point
  a.pos.add(a.vel.clone().scale(1-time));
  b.pos.add(b.vel.clone().scale(1-time));
  p.pos.add(p.vel.clone().scale(1-time));
*/
}

module.exports.distributeVelocities = distributeVelocities;
