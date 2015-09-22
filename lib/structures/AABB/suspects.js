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
    xboo = (  particle.pos.x <= this.max.x &&
              particle.pos.x >= this.min.x );
    yboo = (  particle.pos.y <= this.max.y &&
              particle.pos.y >= this.min.y );
    if(!xboo && !yboo) continue;
    if(xboo && yboo){
      inside.push(particle);
    }
    ari = [[(l+len-1)%len,l], [l, (l+1)%len]];
    ll = 2;
    while(ll--){
      // TODO: Remove this searching alrgorithm
      if(done.indexOf(ari[ll].join("|")) !== -1) continue;
      done.push(ari[ll].join("|"));
      var p1 = particles[ari[ll][0]].pos;
      var p2 = particles[ari[ll][1]].pos;
      // Here I'm checking if both points are inside
      // If they are then we can add the line without a problem
      if(this.containsPoint(p1) || this.containsPoint(p2)){
        lines.push([particles[ari[ll][0]],particles[ari[ll][1]]]);
        continue;
      }
      temp = new this.constructor(p1, p2);
      // Here I'm checking if the AABB between p1,p2 intersects with the big AABB
      // If not then we can ignore this
      // Basically this will occur when
      // Both Points have min.x<x<max.x
      // And Both points max.y<y
      if(!this.intersectsAABB(temp)) continue;
      temp = new Line(p1,p2);
      // Even if AABB intersects, the line may not
      if(!this.intersectsLine(temp)) continue;
      lines.push([particles[ari[ll][0]],particles[ari[ll][1]]]);
    }
  }
  return {inside:inside, lines:lines};
};
