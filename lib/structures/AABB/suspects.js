var Line = require("../Line");

module.exports = function(particles){
  var lines = [];
  var inside = [];
  var done = [];
  var l = particles.length;
  var len = l;
  var xboo = false, yboo = false;
  var temp, ari, ll;
  while(l--){
    var particle = particles[l];
    var nparticle = particles[(l-1+len)%len];
    temp = new this.constructor(particle, nparticle);
    if(!this.intersectsAABB(temp)) continue;
    if(this.containsPoint(particle.pos)){
      inside.push(particle);
      lines.push([particle,nparticle]);
      continue;
    }
    if(this.containsPoint(nparticle.pos)){
      lines.push([particle,nparticle]);
      continue;
    }
    temp = new Line(particle.pos,nparticle.pos);
    if(!this.intersectsLine(temp)) continue;
    lines.push([particle,nparticle]);
  }
  return {inside:inside, lines:lines};
};
