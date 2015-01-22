var AABB = require("../structures/AABB");
var Line = require("../structures/Line")

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
      handleSuspects(
        compositeA.particles[suspectsA.inside[l][0]], //the point
        compositeB.particles[suspectsB.lines[ll][0]], //a of the line
        compositeB.particles[suspectsB.lines[ll][1]],  //b of the line
        timestep
      )
    }
  }
  var l = suspectsB.inside.length;
  var ll;
  while(l--){
    ll = suspectsA.lines.length;
    while(ll--){
      var i = suspectsA.lines[ll][2].intersectsLineSegment(suspectsB.inside[l][1]);
      if(!i){
        i = suspectsA.lines[ll][2].intersectsLineSegment(suspectsB.inside[l][2]);
        if(!i) continue;
      }
      handleSuspects(
        compositeB.particles[suspectsB.inside[l][0]], //the point
        compositeA.particles[suspectsA.lines[ll][0]], //a of the line
        compositeA.particles[suspectsA.lines[ll][1]],  //b of the line
        timestep
      )
    }
  }
  // console.log("collision solved");
}

/*
y = mx+b
m = (
      (time*velA.y + posA.y) - (time*velB.y + posB.y)
    /
      (time*velA.x + posA.x) - (time*velB.x + posB.x)
    )
m = (
      time*(velA.y - velB.y) + (posA.y - posB.y)
    /
      time*(velA.x - velB.x) + (posA.x - posB.x)
    )
b = y - mx
b = (time*velA.y + posA.y) - m*(time*velA.x + posA.x)

y = mx + (time*velA.y + posA.y) - m*(time*velA.x + posA.x)
y = m*(x - (time*velA.x + posA.x)) + (time*velA.y + posA.y)
(y - (time*velA.y + posA.y))*( time*(velA.x - velB.x) + (posA.x - posB.x) )
=
(x - (time*velA.x + posA.x))*( time*(velA.y - velB.y) + (posA.y - posB.y) )

net = (time*vel + pos)

solve for time where x = (time*velP.x + posP.x) and y = (time*velP.y + posP.y)
((time*velP.y + posP.y) - (time*velA.y + posA.y))
*( time*(velA.x - velB.x) + (posA.x - posB.x) )
=
((time*velP.x + posP.x) - (time*velA.x + posA.x))
*( time*(velA.y - velB.y) + (posA.y - posB.y) )

 ( time*(velP.y - velA.y) + (posP.y - posA.y) )
*( time*(velA.x - velB.x) + (posA.x - posB.x) )
=
 ( time*(velP.x - velA.x) + (posP.x - posA.x) )
*( time*(velA.y - velB.y) + (posA.y - posB.y) )

( time*time*(velP.y - velA.y)*(velA.x - velB.x))
+ time*(velP.y - velA.y)*(posA.x - posB.x)
+ time*(velA.x - velB.x)*(posP.y - posA.y)
+ (posP.y - posA.y)*(posA.x - posB.x)
)
=
( time*time*(velP.x - velA.x)*(velA.y - velB.y)
+ time*(velP.x - velA.x)*(posA.y - posB.y)
+ time*(velA.y - velB.y)*(posP.x - posA.x)
+ (posP.x - posA.x)*(posA.y - posB.y)
)
0
=
time*time(
  (velP.x - velA.x)*(velA.y - velB.y)
- (velP.y - velA.y)*(velA.x - velB.x)
)
+ time*(
  (velP.x - velA.x)*(posA.y - posB.y)
+ (velA.y - velB.y)*(posP.x - posA.x)
- (velP.y - velA.y)*(posA.x - posB.x)
- (velA.x - velB.x)*(posP.y - posA.y)
)
+ (posP.x - posA.x)*(posA.y - posB.y)
- (posP.y - posA.y)*(posA.x - posB.x)

0
=
time*time(
(velP.x - velA.x)*(velA.y - velB.y)
- (velP.y - velA.y)*(velA.x - velB.x)
) //cross
+ time*(
(velP.x - velA.x)*(posA.y - posB.y)
- (velP.y - velA.y)*(posA.x - posB.x)
//cross
+ (posP.x - posA.x)*(velA.y - velB.y)
- (posP.y - posA.y)*(velA.x - velB.x)
//cross
)
+ (posP.x - posA.x)*(posA.y - posB.y)
- (posP.y - posA.y)*(posA.x - posB.x)
//cross
*/

function quadraticTime(susP, lineA, lineB){

  var vPsubvA = susP.vel.clone().sub(lineA.vel);
  var vAsubvB = lineA.vel.clone().sub(lineB.vel);
  var pPsubpA = susP.pos.clone().sub(lineA.pos);
  var pAsubpB = lineA.pos.clone().sub(lineB.pos);

  //this.x * v.y - this.y * v.x;
  var a = vPsubvA.cross(vAsubvB);
  var b = vPsubvA.cross(pAsubpB) + pPsubpA.cross(vAsubvB);
  var c = pPsubpA.cross(pAsubpB);

  if(a === 0){
    //no need for quadratic
    if(b === 0) return false;
    return [-c/b]
  }


  var squared = Math.pow(b,2) - 4*a*c;
  if(squared < 0){
    // console.log("QuadraticTime: b^2 - 4ac < 0");
    return false;
  }
  if(squared == 0){
    return [-b/(2*a)];
  }
  var minus = (-b - Math.sqrt(squared))/(2*a)
  var plus = (-b + Math.sqrt(squared))/(2*a)

  return [minus,plus]
}

function handleSuspects(p,a,b,timestep){


  //this finds the time difference in which they first intersect
  var res = quadraticTime(p, a, b);
  if(!res){
    //console.log("no good time")
    return false;
  }
  //make sure we're getting the best point in time, (but what is best?)
  if(res.length == 2){
    if(res[0] > 0){
      if(res[1] > 0){
        //console.log("all are positive");
        return false
      }
      res = res[1];
    }else{
      if(res[1] > 0) res = res[0];
      else res = Math.max(res[0],res[1]);
    }
  }else{
    res = res[0];
  }
  if(Math.abs(res) > timestep){
    //can't reverse time more than timestep
    return false;
  }
  // console.log(res)
  // console.log(timestep)
  res /= timestep;
  // console.log(res)

  //this is supposed to be the point where they first intersect
  a.pos.add(a.vel.clone().scale(res));
  b.pos.add(b.vel.clone().scale(res));
  p.pos.add(p.vel.clone().scale(res));


  //I'm now finding the net velocity of the line at that point
  var ab = a.pos.dist(b.pos);
  var ap = a.pos.dist(p.pos);
  var bp = b.pos.dist(p.pos);
//  console.log("ap: "+(ap/ab));
//  console.log("bp: "+(bp/ab));
  var netv = a.vel.clone().scale(ap/ab).add(b.vel.clone().scale(bp/ab));
//  console.log("avel: "+a.vel);
//  console.log("bvel: "+b.vel);

//  console.log(p.pos);

//  console.log("netv: "+netv);
  //now distributing momentum
  netv.add(p.vel).scale(1/2)

//  console.log("netv`: "+netv);
  p.vel.set(netv);
  if(ap != 0)
    a.vel.set(netv.clone().sub(netv.clone().scale(bp/ab)).scale(ab/ap));
  if(bp != 0)
    b.vel.set(netv.clone().sub(netv.clone().scale(ap/ab)).scale(ab/bp));

//  console.log("avel`: "+a.vel);
//  console.log("bvel`: "+b.vel);

  //now configuring new point
  a.pos.add(a.vel.clone().scale(1-res));
  b.pos.add(b.vel.clone().scale(1-res));
  p.pos.add(p.vel.clone().scale(1-res));
}

module.exports = Collision;
