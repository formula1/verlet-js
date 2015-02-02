/*

The High level of this explanation is

1) Each particle is defined as
  (position + velocity*time)
2) Using this, I can create a linear equation from two particles where...
  m = (positionA.y + velocityA.y*time) - (positionB.y + velocityB.y*time)
    / (positionA.x + velocityA.x*time) - (positionB.x + velocityB.x*time)
  and
  b = (positionA.y + velocityA.y*time) - (positionA.x + velocityA.x*time)*m

3) Since I'm tring to find the exact time where a point is on a line, the equation
    becomes
  y = mx + b
  (positionP.y + velocityP.y*time) = m*(positionP.x + velocityP.x*time) + b

4) From here its about simplifying the equation until I get something solvable for time
  I soon learned that the equation becomes a quadratic equation
  a*time^2 + b*time + c

4a)
  as a result I can solve all the issue with
  (-b (+||-) (b^2 - 4*a*c)^(1/2) ) / (2*a)

4b) if a = 0, then the equation becomes even simpler
  time = -c/b

4c) if b is 0 and a is 0, we have nothing.

5) However, The times I'm looking for are specific.

5a) The time should be negative. I don't want to predict the future, I want to fix the past
5b) The time cannot be larger than the current timestep. If it is, we are looking too far back
5c) there may be a possibility that there are two times that fit our description.
  as a result, we want to find the one that happened first. A simply Math.min works

6) Return the value!

*/


module.exports.getImpacts = function(susP, lineA, lineB){

  var vPsubvA = susP.vel.clone().sub(lineA.vel);
  var vAsubvB = lineA.vel.clone().sub(lineB.vel);
  var pPsubpA = susP.pos.clone().sub(lineA.pos);
  var pAsubpB = lineA.pos.clone().sub(lineB.pos);

  var a = vPsubvA.cross(vAsubvB);
  var b = vPsubvA.cross(pAsubpB) + pPsubpA.cross(vAsubvB);
  var c = pPsubpA.cross(pAsubpB);

  if(a === 0){
    //no need for quadratic
    if(b === 0) return false;
    return [-c/b];
  }
  var squared = Math.pow(b,2) - 4*a*c;
  if(squared < 0){
    return false;
  }

  if(squared === 0){
    return [-b/(2*a)];
  }
  var minus = (-b - Math.sqrt(squared))/(2*a);
  var plus = (-b + Math.sqrt(squared))/(2*a);



  return [minus,plus];
};

module.exports.restrict = function(times, timestep){
  var ret = false;
  var l = times.length;
  while(l--){
    if(times[l] > 0) continue;
    if(times[l] < -timestep) continue;
    ret = Math.min(ret,times[l]);
  }
  return ret;
};


/*
y = m*x+b
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
b = y - m*x

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
