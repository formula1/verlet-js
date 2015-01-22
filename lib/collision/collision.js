var AABB = require("../structures/AABB");

function Collision(compositeA, compositeB, timestep){

  var AABB_A = new AABB();
  var AABB_B = new AABB();
  var l = compositeA.particles.length;
  while(l--){
    AABB_A.digestPoint(compositeA.particles[l].pos);
  }
  l = compositeB.particles.length;
  while(l--){
    AABB_B.digestPoint(compositeB.particles[l].pos);
  }
  if(!AABB_A.intersectsAABB(AABB_B)){
    return false;
  }

  var manifold = AABB_A.sub(AABB_A);

  var suspectsA = manifold.getSuspects(compositeA.particles);
  var suspectsB = manifold.getSuspects(compositeB.particles);
  if(suspectsA.lines.length == 0 || suspectsB.lines.length == 0)
    return false;
  if(suspectsA.inside.length == 0 && suspectsB.inside.length == 0)
    return false;
  var l = suspectsA.inside.length;
  var ll;
  while(l--){
    ll = suspectsB.lines.length;
    while(ll--){
      var i = suspectsB.lines[ll][2].intersectsLineSegment(suspectsA.inside[l][1]);
      if(!i){
        i = suspectsB.lines[ll][2].intersectsLineSegment(suspectsA.inside[l][2]);
        if(!i) continue;
      }
      var p = compositeA.particles[suspectsA.inside[l][0]];
      var a = compositeB.particles[suspectsB.lines[ll][0]];
      var b = compositeB.particles[suspectsB.lines[ll][1]];


      //this finds the time difference in which they first intersect
      var res = quadraticTime(p, a, b);
      if(!res){
        console.log("no good time")
        continue;
      }
      //make sure we're getting the best point in time, (but what is best?)
      if(res.length == 2){
        if(res[0] > 0){
          if(res[1] > 0) return false
          res = res[1];
        }else{
          if(res[1] > 0) res = res[0];
          else res = Math.max(res[0],res[1]);
        }
      }else{
        res = res[0];
      }
      if(Math.abs(res) > timestep) return false;

      //this is supposed to be the point where they first intersect
      a.pos.add(a.vel.clone().scale(res));
      b.pos.add(b.vel.clone().scale(res));
      p.pos.add(p.vel.clone().scale(res));

      //I'm now finding the net velocity of the line at that point
      var ab = suspectsB.lines[ll][2].length;
      var ap = a.pos.dist(p.pos);
      var bp = b.pos.dist(p.pos);
      var netv = a.vel.clone().scale(ap/ab).add(b.vel.clone().scale(bp/ab));

      //now distributing momentum
      netv.add(p.vel).scale(1/2)
      p.vel.set(netv);
      if(ap != 0)
        a.vel.set(netv.clone().sub(netv.clone().scale(bp/ab)).scale(ab/ap));
      if(bp != 0)
        b.vel.set(netv.clone().sub(netv.clone().scale(ap/ab)).scale(ab/bp));

      //now configuring new point
      a.pos.add(a.vel.clone().scale(timestep-res));
      b.pos.add(b.vel.clone().scale(timestep-res));
      p.pos.add(p.vel.clone().scale(timestep-res));
    }
  }
  console.log("collision solved");
}

function quadraticTime(intp, linepA, linepB){
  var posp = intp.pos;
  var pospA = linepA.pos;
  var pospB = linepB.pos;
  var velp = intp.vel;
  var velpA = linepA.vel;
  var velpB = linepB.vel;

  var a = velpB.cross(velpA) + velp.cross(velpA.clone().sub(velpB));

  var b = posp.clone().cross(velpA.clone().sub(velpB))
  + velp.cross(pospA.clone().sub(pospB))
  + pospA.cross(velpB)
  + pospB.cross(velpA)
  + pospA.cross(velpA)*2;

  var c = posp.cross(pospA.clone().sub(pospB))
  + pospB.x*pospB.y - pospA.x*pospA.y;

  if(a === 0){
    //no need for quadratic
    return [-c/b]
  }


  var squared = Math.pow(b,2) - 4*a*c;
  if(squared < 0){
    console.log("QuadraticTime: b^2 - 4ac < 0");
    return false;
  }
  if(squared == 0){
    return [-b/(2*a)];
  }
  console.log(Math.sqrt(squared));
  var minus = (-b - Math.sqrt(squared))/(2*a)
  var plus = (-b + Math.sqrt(squared))/(2*a)

  return [minus,plus]
}

module.exports = Collision;
