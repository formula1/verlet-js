
/*
Copyright 2013 Sub Protocol and other contributors
http://subprotocol.com/

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

function getGreatestVelocity(polygons){
}

module.exports = function(step) {
  var i, j, c;

  this.polygons.sort(function(a,b){
    a.aabb.min.x - b.aabb.min.x
  })
  while(step > 0){
    //find greatest velocity and smallest area
    //http://jsperf.com/sort-and-first-or-iterate
    var l = this.composites.length;
    var maxVel = Math.NEGATIVE_INFINITY;
    var minAABBsize = Math.POSITIVE_INFINITY;
    while(l--){
      var ll = this.composits[l].particles.length;
      var compAABB = new AABB();
      while(ll--){
        min = Math.min(polgons[l],min);
        max = Math.min(polgons[l],max);
      }
    }

    //Calculate substep
    substep = smallestarea/(largestvelocity/Math.convertToSecond(substep));

    substep = Math.min(substep,step);
    var l = polygon.length
    var ll;
    var dirty = false;
    var minstep = substep;
    var u = l;
    while(l--){
      ll = l-1;
      while(ll--){
        if(polygon[l].max.x < polygon[ll].min.x) break;
        intersection = polygon[l].timeOfIntersection(polygon[ll],minstep);
        if(intersection){
          u = l+1
          dirty = intersection;
          minstep = intersection.time;
        }
      }
    }
    l = polygon.length;
    for(u;u < l;u++){
      polygon[u].applyVelocities(minstep);
    }
    if(minstep < substep){
      dirty.distributeVelocities();
    }
    step -= minstep;
  }



  for (c in this.composites) {
    var particles = this.composites[c].particles;
    for (i in particles) {

      // calculate velocity
      var velocity = particles[i].pos.clone().sub(particles[i].lastPos).scale(this.friction);

      // ground friction
      if (particles[i].pos.y >= this.height-1 && velocity.length2() > 0.000001) {
        velocity.scale(this.groundFriction);
      }

      // save last good state
      particles[i].lastPos.set(particles[i].pos);

      // gravity
      particles[i].pos.add(this.gravity);

      // inertia
      particles[i].pos.add(velocity);
    }
  }

  this.logic();

  // relax
  var stepCoef = 1/step;
  for (c in this.composites) {
    var constraints = this.composites[c].constraints;
    for (i=0;i<step;++i)
      for (j in constraints)
        constraints[j].relax(stepCoef);
  }

  // bounds checking
  for (c in this.composites) {
    var particles = this.composites[c].particles;
    for (i in particles)
      this.bounds(particles[i]);
  }
}
