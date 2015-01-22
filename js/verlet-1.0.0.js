;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){

//this exports all the verlet methods globally, so that the demos work.

require("./verlet-polyfill");
var VerletDraw = require('./verlet-draw')
var VerletJS = require('./verlet')
var constraint = require('./constraint')
								 require('./objects') //patches VerletJS.prototype (bad)
window.Vec2 = require('./structures/Vec2')
window.VerletJS = VerletJS
window.VerletDraw = VerletDraw;

window.Particle = VerletJS.Particle

for(var i in constraint){
	window[i] = constraint[i]
}

},{"./constraint":5,"./objects":6,"./structures/Vec2":7,"./verlet":4,"./verlet-draw":3,"./verlet-polyfill":2}],2:[function(require,module,exports){
if(!Math.sign){
  Math.sign = function(x){
    if( +x === x ) { // check if a number was given
      return (x === 0) ? x : (x > 0) ? 1 : -1;
    }
    return NaN;
  }
}

if(!Math.quadratic){
  //x = (-b +- b*b - 4ac )/(2a)
  Math.quadratic = function(a,b,c){
    var ret = b*b - 4*a*c;
    if(ret < 0) return false;
    if(ret == 0) return [-b/(2*a)];
    a *= 2;
    ret = Math.sqrt(ret)/a;
    b *= -1/a
    return [b + ret, b - ret];
  }
}

if(!Math.lawCos){
  //x = (-b +- b*b - 4ac )/(2a)
  Math.lawCos = function(a,b,c){
    return Math.acos(
      (-a*a + b*b + c*c)/
      (2*b*c)
    );
  }
}

},{}],7:[function(require,module,exports){

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

// A simple 2-dimensional vector implementation

module.exports = Vec2

function Vec2(x, y) {
	this.x = x || 0;
	this.y = y || 0;
	var _this = this;
	Object.defineProperty(this,"asArray",{
		get:function(){
			return [_this.x,_this.y];
		}
	});
}

Vec2.prototype.zero = function(){
	this.x = 0;
	this.y = 0;
	return this;
}

Vec2.prototype.posinf = function(){
	this.x = Number.POSITIVE_INFINITY;
	this.y = Number.POSITIVE_INFINITY;
	return this;
}

Vec2.prototype.neginf = function(){
	this.x = Number.NEGATIVE_INFINITY;
	this.y = Number.NEGATIVE_INFINITY;
	return this;
}

Vec2.prototype.isNaN = function(){
	if(isNaN(this.x)) return true;
	if(isNaN(this.y)) return true;
	return false;
}

Vec2.prototype.clone = function(){
	return new Vec2(this.x,this.y);
}

Vec2.prototype.add = function(v) {
	this.x += v.x;
	this.y += v.y;
	return this;
};

Vec2.prototype.sub = function(v){
	this.x -= v.x;
	this.y -= v.y;
	return this;
}

Vec2.prototype.mul = function(v) {
	if(typeof v == "number"){
		return this.scale(v)
	}
	this.x *= v.x;
	this.y *= v.y;
	return this;
}

Vec2.prototype.div = function(v) {
	if(typeof v == "number"){
		return this.scale(1/v)
	}
	this.x /= v.x;
	this.y /= v.y;
	return this;
}

Vec2.prototype.scale = function(coef) {
	this.x *= coef;
	this.y *= coef;
	return this;
}

Vec2.prototype.scaleI = function(coef) {
	this.x /= coef;
	this.y /= coef;
	return this;
}


Vec2.prototype.pow = function(num){
	this.x = Math.pow(this.x,num);
	this.y = Math.pow(this.y,num);
	return this;
}


Vec2.prototype.normalize = function(){
	var len = this.length();
	this.x /= len;
	this.y /= len;
	return this;
}

Vec2.prototype.normal = function() {
	var m = Math.sqrt(this.x*this.x + this.y*this.y);
	return new Vec2(this.x/m, this.y/m);
}

Vec2.prototype.rotate = function(origin, theta) {
	var x = this.x - origin.x;
	var y = this.y - origin.y;
	this.x = x*Math.cos(theta) - y*Math.sin(theta) + origin.x;
	this.y = x*Math.sin(theta) + y*Math.cos(theta) + origin.y;
	return this;
}

Vec2.prototype.min = function(v){
	this.x = Math.min(this.x, v.x);
	this.y = Math.min(this.y, v.y);
	return this;
}

Vec2.prototype.mid = function(v){
	this.x = (this.x+v.x)/2;
	this.y = (this.y+v.y)/2;
	return this;
}

Vec2.prototype.max = function(v){
	this.x = Math.max(this.x, v.x);
	this.y = Math.max(this.y, v.y);
	return this;
}

Vec2.prototype.set = function(v) {
	this.x = v.x;
	this.y = v.y;
	return this;
}

Vec2.prototype.swap = function() {
	var temp = this.x;
	this.x = this.y;
	this.y = temp;
	return this;
}


Vec2.prototype.equals = function(v) {
	return this.x == v.x && this.y == v.y;
}

Vec2.prototype.epsilonEquals = function(v, epsilon) {
	return Math.abs(this.x - v.x) <= epsilon && Math.abs(this.y - v.y) <= epsilon;
}

Vec2.prototype.length = function() {
	return Math.sqrt(this.x*this.x + this.y*this.y);
}

Vec2.prototype.length2 = function() {
	return this.x*this.x + this.y*this.y;
}

Vec2.prototype.dist = function(v) {
	return Math.sqrt(this.dist2(v));
}

Vec2.prototype.dist2 = function(v) {
	var x = v.x - this.x;
	var y = v.y - this.y;
	return x*x + y*y;
}

Vec2.prototype.dot = function(v) {
	return this.x*v.x + this.y*v.y;
}

Vec2.prototype.cross = function(v){
	return this.x * v.y - this.y * v.x;
}

Vec2.prototype.angle = function(v) {
	return Math.atan2(this.x*v.y-this.y*v.x,this.x*v.x+this.y*v.y);
}

Vec2.prototype.angle2 = function(vLeft, vRight) {
	return vLeft.clone().sub(this).angle(vRight.clone().sub(this));
}

Vec2.prototype.slope = function(){
	return this.y / this.x;
}

Vec2.prototype.sum = function(){
	return this.y + this.x;
}


Vec2.prototype.toString = function() {
	return "(" + this.x + ", " + this.y + ")";
}

},{}],3:[function(require,module,exports){

window.requestAnimFrame = window.requestAnimationFrame
|| window.webkitRequestAnimationFrame
|| window.mozRequestAnimationFrame
|| window.oRequestAnimationFrame
|| window.msRequestAnimationFrame
|| function(callback) {
  window.setTimeout(callback, 1000 / 60);
};
var VerletJS = require("./verlet.js");
module.exports = VerletDraw;

function VerletDraw(width, height, canvas, physics) {
  this.width = width;
  this.height = height;
  this.canvas = canvas;
  this.ctx = canvas.getContext("2d");
  this.mouse = new Vec2(0,0);
  this.mouseDown = false;
  this.draggedEntity = null;
  this.selectionRadius = 20;
  this.highlightColor = "#4f545c";
  this.physics = (!physics)?new VerletJS(width,height):physics;

  var _this = this;

  this.physics.logic = function(){
    // handle dragging of entities
    if (_this.draggedEntity)
      _this.draggedEntity.pos.set(_this.mouse);
  }


  // prevent context menu
  this.canvas.oncontextmenu = function(e) {
    e.preventDefault();
  };

  this.canvas.onmousedown = function(e) {
    _this.mouseDown = true;
    var nearest = _this.physics.nearestEntity(_this.mouse,_this.selectionRadius);;
    if (nearest) {
      _this.draggedEntity = nearest;
      console.log(nearest.pos);
    }
  };

  this.canvas.onmouseup = function(e) {
    _this.mouseDown = false;
    _this.draggedEntity = null;
  };

  this.canvas.onmousemove = function(e) {
    var rect = _this.canvas.getBoundingClientRect();
    _this.mouse.x = e.clientX - rect.left;
    _this.mouse.y = e.clientY - rect.top;
  };

}


VerletDraw.prototype.draw = function() {
  var i, c;

  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  var composites = this.physics.composites;
  for (c in composites) {
    // draw constraints
    if (composites[c].drawConstraints) {
      composites[c].drawConstraints(this.ctx, composites[c]);
    } else {
      var constraints = composites[c].constraints;
      for (i in constraints)
        constraints[i].draw(this.ctx);
    }

    // draw particles
    if (composites[c].drawParticles) {
      composites[c].drawParticles(this.ctx, composites[c]);
    } else {
      var particles = composites[c].particles;
      for (i in particles)
        particles[i].draw(this.ctx);
    }
  }

  // highlight nearest / dragged entity
  var nearest = this.draggedEntity || this.physics.nearestEntity(this.mouse,this.selectionRadius);
  if (nearest) {
    this.ctx.beginPath();
    this.ctx.arc(nearest.pos.x, nearest.pos.y, 8, 0, 2*Math.PI);
    this.ctx.strokeStyle = this.highlightColor;
    this.ctx.stroke();
  }
}

},{"./verlet.js":4}],4:[function(require,module,exports){

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

var Vec2 = require('./structures/Vec2')
var Collision = require("./collision/collision");

exports = module.exports = VerletJS
var Particle = exports.Particle = require("./structures/Particle");
var Composite = exports.Composite = require("./structures/Composite");
exports.Composite = Composite


function VerletJS(width, height) {
	this.width = width;
	this.height = height;

	this.bounds = function (particle) {
		if (particle.pos.y > this.height-1)
			particle.pos.y = this.height-1;

		if (particle.pos.x < 0)
			particle.pos.x = 0;

		if (particle.pos.x > this.width-1)
			particle.pos.x = this.width-1;
	}

	// simulation params
	this.gravity = new Vec2(0,0.2);
	this.friction = 0.99;
	this.groundFriction = 0.8;

	// holds composite entities
	this.composites = [];
}

VerletJS.prototype.Composite = Composite

VerletJS.prototype.logic = function(){
	throw new Error("Logic hasn't been set")
}

VerletJS.prototype.frame = function(step) {
	var i, j, c;

	for (c in this.composites) {
		var particles = this.composites[c].particles;
		for (i in particles) {
			// save last good state
			particles[i].lastPos.set(particles[i].pos);

			// gravity
			particles[i].pos.add(this.gravity);

			// inertia
			particles[i].pos.add(particles[i].vel);

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
		for (i in particles){

			this.bounds(particles[i]);
			// calculate velocity
			particles[i].vel
			.set(particles[i].pos)
			.sub(particles[i].lastPos)
			.scale(this.friction)
			// ground friction
			if (particles[i].pos.y >= this.height-1 && particles[i].vel.length2() > 0.000001) {
				particles[i].vel.scale(this.groundFriction);
			}
		}
	}
	var l = this.composites.length;
	var ll;
	while(l--){
		ll = l;
		while(ll--){
			Collision(this.composites[l], this.composites[ll], step);
		}
	}
}


VerletJS.prototype.nearestEntity = function(target_vec2,radius) {
	var c, i;
	var d2Nearest = 0;
	var entity = null;
	var constraintsNearest = null;

	// find nearest point
	for (c in this.composites) {
		var particles = this.composites[c].particles;
		for (i in particles) {
			var d2 = particles[i].pos.dist2(target_vec2);
			if (d2 <= radius*radius && (entity == null || d2 < d2Nearest)) {
				entity = particles[i];
				constraintsNearest = this.composites[c].constraints;
				d2Nearest = d2;
			}
		}
	}

	// search for pinned constraints for this entity
	for (i in constraintsNearest)
		if (constraintsNearest[i] instanceof PinConstraint && constraintsNearest[i].a == entity)
			entity = constraintsNearest[i];

	return entity;
}

},{"./collision/collision":8,"./structures/Composite":10,"./structures/Particle":9,"./structures/Vec2":7}],5:[function(require,module,exports){

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

// DistanceConstraint -- constrains to initial distance
// PinConstraint -- constrains to static/fixed point
// AngleConstraint -- constrains 3 particles to an angle

var Vec2 = require("./structures/Vec2")

exports.DistanceConstraint = require("./constraints/DistanceConstraint");
exports.PinConstraint = require("./constraints/PinConstraint");
exports.AngleConstraint = require("./constraints/AngleConstraint");
exports.MidpointAreaConstraint = require("./constraints/AreaConstraint");
exports.ScaledAreaConstraint = require("./constraints/InflateAreaConstraint");

},{"./constraints/AngleConstraint":13,"./constraints/AreaConstraint":14,"./constraints/DistanceConstraint":11,"./constraints/InflateAreaConstraint":15,"./constraints/PinConstraint":12,"./structures/Vec2":7}],6:[function(require,module,exports){

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

// generic verlet entities

var VerletJS = require('./verlet')
var Particle = VerletJS.Particle
var constraints = require('./constraint')
var DistanceConstraint = constraints.DistanceConstraint

VerletJS.prototype.point = function(pos) {
	var composite = new this.Composite();
	composite.particles.push(new Particle(pos));
	this.composites.push(composite);
	return composite;
}

VerletJS.prototype.lineSegments = function(vertices, stiffness, circle) {
	var i;

	var composite = new this.Composite();

	for (i in vertices) {
		composite.particles.push(new Particle(vertices[i]));
		if (i > 0)
			composite.constraints.push(
				new DistanceConstraint(
					composite.particles[i],
					composite.particles[i-1],
					stiffness
				)
			);
	}
	if(circle){
		composite.constraints.push(
			new DistanceConstraint(
				composite.particles[composite.particles.length-1],
				composite.particles[0],
				stiffness
			)
		)
	}

	this.composites.push(composite);
	return composite;
}

VerletJS.prototype.cloth = function(origin, width, height, segments, pinMod, stiffness) {

	var composite = new this.Composite();

	var xStride = width/segments;
	var yStride = height/segments;

	var x,y;
	for (y=0;y<segments;++y) {
		for (x=0;x<segments;++x) {
			var px = origin.x + x*xStride - width/2 + xStride/2;
			var py = origin.y + y*yStride - height/2 + yStride/2;
			composite.particles.push(new Particle(new Vec2(px, py)));

			if (x > 0){
				composite.constraints.push(
					new DistanceConstraint(
						composite.particles[y*segments+x],
						composite.particles[y*segments+x-1],
						stiffness
					)
				);
			}

			if (y > 0){
				composite.constraints.push(
					new DistanceConstraint(
						composite.particles[y*segments+x],
						composite.particles[(y-1)*segments+x],
						stiffness
					)
				);
			}
		}
	}

	for (x=0;x<segments;++x) {
		if (x%pinMod == 0)
		composite.pin(x);
	}

	this.composites.push(composite);
	return composite;
}

VerletJS.prototype.tire = function(origin, radius, segments, spokeStiffness, treadStiffness) {
	var stride = (2*Math.PI)/segments;
	var i;

	var composite = new this.Composite();

	// particles
	for (i=0;i<segments;++i) {
		var theta = i*stride;
		composite.particles.push(new Particle(new Vec2(origin.x + Math.cos(theta)*radius, origin.y + Math.sin(theta)*radius)));
	}

	var center = new Particle(origin);
	composite.particles.push(center);

	// constraints
	for (i=0;i<segments;++i) {
		composite.constraints.push(
			new DistanceConstraint(
				composite.particles[i],
				composite.particles[(i+1)%segments],
				treadStiffness
			)
		);
		composite.constraints.push(
			new DistanceConstraint(
				composite.particles[i],
				center,
				spokeStiffness
			)
		);
		composite.constraints.push(
			new DistanceConstraint(
				composite.particles[i],
				composite.particles[(i+5)%segments],
				treadStiffness
			)
		);
	}

	this.composites.push(composite);
	return composite;
}

},{"./constraint":5,"./verlet":4}],10:[function(require,module,exports){

function Composite() {
  this.particles = [];
  this.constraints = [];

  this.drawParticles = null;
  this.drawConstraints = null;
}

Composite.prototype.pin = function(index, pos) {
  pos = pos || this.particles[index].pos;
  var pc = new PinConstraint(this.particles[index], pos);
  this.constraints.push(pc);
  return pc;
}

module.exports = Composite;

},{}],11:[function(require,module,exports){
function DistanceConstraint(a, b, stiffness, distance /*optional*/) {
  this.a = a;
  this.b = b;
  this.distance = typeof distance != "undefined" ? distance : a.pos.clone().sub(b.pos).length();
  this.stiffness = stiffness;
}

DistanceConstraint.prototype.relax = function(stepCoef) {
  var normal = this.a.pos.clone().sub(this.b.pos);
  var m = normal.length2();
  normal.scale(((this.distance*this.distance - m)/m)*this.stiffness*stepCoef);
  this.a.pos.add(normal);
  this.b.pos.sub(normal);
}

DistanceConstraint.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.moveTo(this.a.pos.x, this.a.pos.y);
  ctx.lineTo(this.b.pos.x, this.b.pos.y);
  ctx.strokeStyle = "#d8dde2";
  ctx.stroke();
}

module.exports = DistanceConstraint;

},{}],13:[function(require,module,exports){
function AngleConstraint(a, b, c, stiffness) {
  this.a = a;
  this.b = b;
  this.c = c;
  this.angle = this.b.pos.angle2(this.a.pos, this.c.pos);
  this.stiffness = stiffness;
}

AngleConstraint.prototype.relax = function(stepCoef) {
  var angle = this.b.pos.angle2(this.a.pos, this.c.pos);
  var diff = angle - this.angle;

  if (diff <= -Math.PI)
    diff += 2*Math.PI;
  else if (diff >= Math.PI)
    diff -= 2*Math.PI;

    diff *= stepCoef*this.stiffness;

    this.a.pos.rotate(this.b.pos, diff);
    this.c.pos.rotate(this.b.pos, -diff);
    this.b.pos.rotate(this.a.pos, diff);
    this.b.pos.rotate(this.c.pos, -diff);
  }

  AngleConstraint.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.a.pos.x, this.a.pos.y);
    ctx.lineTo(this.b.pos.x, this.b.pos.y);
    ctx.lineTo(this.c.pos.x, this.c.pos.y);
    var tmp = ctx.lineWidth;
    ctx.lineWidth = 5;
    ctx.strokeStyle = "rgba(255,255,0,0.2)";
    ctx.stroke();
    ctx.lineWidth = tmp;
  }

  module.exports = AngleConstraint;

},{}],8:[function(require,module,exports){
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

},{"../structures/AABB":16}],9:[function(require,module,exports){
var Vec2 = require("./Vec2")

function Particle(pos) {
  this.pos = (new Vec2()).set(pos);
  this.lastPos = (new Vec2()).set(pos);
  this.vel = new Vec2();
}

Particle.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.arc(this.pos.x, this.pos.y, 2, 0, 2*Math.PI);
  ctx.fillStyle = "#2dad8f";
  ctx.fill();
}


module.exports = Particle;

},{"./Vec2":7}],12:[function(require,module,exports){
var Vec2 = require("../structures/Vec2")

function PinConstraint(a, pos) {
  this.a = a;
  this.pos = (new Vec2()).set(pos);
}

PinConstraint.prototype.relax = function(stepCoef) {
  this.a.pos.set(this.pos);
}

PinConstraint.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.arc(this.pos.x, this.pos.y, 6, 0, 2*Math.PI);
  ctx.fillStyle = "rgba(0,153,255,0.1)";
  ctx.fill();
}

module.exports = PinConstraint;

},{"../structures/Vec2":7}],14:[function(require,module,exports){
var Vec2 = require("../structures/Vec2");
var Triangle = require("../structures/Triangle");
var Polygon = require("../structures/Polygon");
var AABB = require("../structures/AABB")


function AreaConstraint(points, stiffness) {
  if(Array.isArray(points)){
    //nothing
  }else{
    points = Array.prototype.slice.call(arguments,0);
    stiffness = points.pop();
  }
  if(points.length < 3){
    throw new Error("need at least three points in args or as an array to retain an area");
  }
  this.points = Polygon(points);
  this.area = this.points.getArea();
  this.storedarea = 0;
  this.storedmid = 0;
  this.storedaabb = new AABB();
  if(!this.area || this.area == 0){
    throw new Error("cannot calculate a nonexistant area");
  }
  this.stiffness = stiffness;
}

AreaConstraint.prototype.relax = function(stepCoef) {
  var area = 0;//the current area
  var mid = new Vec2();
  var l = this.points.length;
  this.points.forThree(function(prev,curr,next){
    area += curr.cross(next);
    mid.add(curr.clone().scale(1/l))
  })
  if(area <= 0){
    alert("negative area");
    throw new Error("negative area");
  }

  //I have the two areas
  var diff = Math.sqrt((
    this.area* //The desired area
    (this.stiffness*stepCoef)
    +(1-this.stiffness*stepCoef)
    *area
  )/area);

  //I want to have all points to either push away from the mid or towards the mid
  //The extremity is dependent on the distance
  //Get the distance between mid and point
  //make the distance the appropriate proportion
  this.storedarea = 0;
  this.storedmid = new Vec2();


  var _this = this;
  var eq = false
  var curr_array = [];
  this.points.forThree(function(prev,curr,next,i){
    var ok = true;
    /*
    if(curr.equals(next)){
      eq = prev;
      curr_array.push(curr);
      return;
    }
    if(eq){
      prev = eq;
      eq = false;
      curr_array.push(curr)

    }
    */
    var tri = new Triangle(prev,curr,next);
    if(tri.isConcave()){
      if(tri.hasPoint(_this.storedmid)){
        problem = true;
      }
      var intersections = _this.points.getIntersects(prev,curr,i);
      if(intersections.length > 0){
        //alert("you may get a negative area here");
        ok = false;
      }
    }
    if(ok){}
    /*
    if(curr_array.length){
      while(curr_array.length){
        _this.storedmid.add(
          curr_array.pop().sub(mid).scale(diff).add(mid)
          .clone().scale(1/l)
        );
      }
    }else{
    */
      _this.storedmid.add(
        curr.sub(mid).scale(diff).add(mid)
        .clone().scale(1/l)
      );
//    }

    if(curr != _this.points[0]){
      _this.storedarea += prev.cross(curr);
    }
    _this.storedaabb.digestPoint(curr);
  })
}
AreaConstraint.prototype.draw = function(ctx) {
  var diff = Math.floor(Math.min(255,255*this.area/this.storedarea));
  var inv = Math.floor(Math.min(255,255*this.storedarea/this.area));
  ctx.beginPath();
  ctx.moveTo(this.points[0].x, this.points[0].y);
  var _this = this;
  var problem = false;
  var intersects = [];
  var eq = false;
  this.points.forThree(function(prev,curr,next,i){
    /*
    if(curr.equals(next)){
      eq = prev
      return;
    }
    if(eq){
      prev = eq;
      eq = false;
    }
    */
    var tri = new Triangle(prev,curr,next);
    if(tri.isConcave()){
      if(tri.hasPoint(_this.storedmid)){
        problem = true;
      }
    }
    var intersections = _this.points.getIntersects(prev,curr,i);
    if(intersections.length > 0){
      //        alert("you may get a negative area here");
      intersects = intersects.concat(intersections);
    }
    ctx.lineTo(curr.x,curr.y);
  })

  var g = (diff < inv)?diff:inv;
  ctx.closePath();
  ctx.fillStyle="rgba("+diff+","+g+","+inv+",0.6)";
  ctx.fill();


  for(var i=intersects.length;i--;){
    ctx.beginPath();
    ctx.arc(
      intersects[i].x,
      intersects[i].y,
      8, 0, 2 * Math.PI, false
    );
    ctx.fillStyle = "#FF8300";
    ctx.fill();
  };

  var tri = this.points.getDelaney();
  for(i = tri.length; i; ) {
    ctx.beginPath();
    --i; ctx.moveTo(this.points[tri[i]].x, this.points[tri[i]].y);
    --i; ctx.lineTo(this.points[tri[i]].x, this.points[tri[i]].y);
    --i; ctx.lineTo(this.points[tri[i]].x, this.points[tri[i]].y);
    ctx.closePath();
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(
    this.storedmid.x,
    this.storedmid.y,
    2, 0, 2 * Math.PI, false
  );
  ctx.fillStyle = problem?"#FF0000":"#00FF00";
  ctx.fill();
}

module.exports = AreaConstraint;


//finding half the area of a circle
// A = pi * r^2
// A/2 = pi/2 * r^2
// dA = pi/d * r^2
// we know current area
// we know desired area
// (dA/cA) * cA = (dA/cA) * pi * r^2
// we're looking for the change in r that corresponds to change in A
// sqrt(A/pi) = r

//new_r = (circle_r/sqrt(Area))


// we find the porportion between cur and desired
// multiply current distance by that porportion

//	diff = 1/Math.sqrt(diff);
//	diff *= stepCoef*this.stiffness;
/*
This code will not work properly since pushing outward may not work for certian
concave polygons

What is needed is to find a single multiplier that the distance between each point
can be multiplied by to give the area desired

I good example is something such as

There are a few issues here
1) backwards points
- The moment it intersects, we get negative area
2) Intersections around midpoint
- the moment it intersects around the midpoint, it will go haywire
- Can we detect if the angle passes over the midpoint?
-should we compensate for that?
3) The midpoint pushing outward concept actually enforces angle
-It causes angles to generally want to be equalateral
4) Concave till ignoring midpoint
5) midpoint is technically at the bottom despite most of the area being up top
-This problem is where we are calculating the midpoint based of angle points
-Instead of basing it off all points (line segments are points technically)
-sampling points off each segment will give an innaccurate calculation
-after finding total perimiter, is it possible to base the amount of influence
-off of length?


*/

},{"../structures/AABB":16,"../structures/Polygon":18,"../structures/Triangle":17,"../structures/Vec2":7}],15:[function(require,module,exports){
var Vec2 = require("../structures/Vec2");
var Line = require("../structures/Line");
var Triangle = require("../structures/Triangle");
var Polygon = require("../structures/Polygon");
var AABB = require("../structures/AABB")


function AreaConstraint(points, stiffness) {
  if(Array.isArray(points)){
    //nothing
  }else{
    points = Array.prototype.slice.call(arguments,0);
    stiffness = points.pop();
  }
  if(points.length < 3){
    throw new Error("need at least three points in args or as an array to retain an area");
  }
  this.points = Polygon(points);
  this.area = this.points.getArea();
  this.storedarea = 0;
  this.storedmid = 0;
  this.storedaabb = new AABB();
  if(!this.area || this.area == 0){
    throw new Error("cannot calculate a nonexistant area");
  }
  this.stiffness = stiffness;
}

AreaConstraint.prototype.relax = function(stepCoef) {
  var area = 0;//the current area
  var mid = new Vec2();

  var l = this.points.length;
  this.points.forThree(function(prev,curr,next){
    area += curr.cross(next);
    mid.add(curr.clone().scale(1/l))
    //perimeter += curr.dist(next);
  })
  if(area <= 0){
    alert("negative area");
    throw new Error("negative area");
  }

  //I have the two areas
  var diff = (
    this.area* //The desired area
    (this.stiffness*stepCoef)
    +(1-this.stiffness*stepCoef)
    *area
  )/area;

  var _this = this;
  var eq = false
  var lastcurr = this.points[this.points.length-1];
  var lastnext = this.points[0].clone();
  var _prev = this.points[this.points.length-1];
  var nm = new Vec2();
  this.points.forThree(function(prev,curr,next,i){
    var nl = curr.clone();
    curr.sub(_prev).scale(diff).add(prev);
    nm.add(curr.clone().scale(1/l))
    _prev = nl;
  })
  while(l--){
    this.points[l].sub(nm).add(mid);
  }
  this.storedarea = area*diff;
  this.storedmid = mid;
}
AreaConstraint.prototype.draw = function(ctx) {
  var diff = Math.floor(Math.min(255,255*this.area/this.storedarea));
  var inv = Math.floor(Math.min(255,255*this.storedarea/this.area));
  var _this = this;
  var problem = false;
  var intersects = [];
  var eq = false;
  var effectivepoints = [];
  //fill
  var l = this.points.length-1;
  ctx.beginPath();
  ctx.moveTo(this.points[l].x, this.points[l].y);
  while(l--){
    ctx.lineTo(this.points[l].x,this.points[l].y);
  }
  var g = (diff < inv)?diff:inv;
  ctx.closePath();
  ctx.fillStyle="rgba("+diff+","+g+","+inv+",0.6)";
  ctx.fill();
  //delaney
  /*
  var tri = this.points.getDelaney();
  for(i = tri.length; i; ) {
    ctx.beginPath();
    --i; ctx.moveTo(this.points[tri[i]].x, this.points[tri[i]].y);
    --i; ctx.lineTo(this.points[tri[i]].x, this.points[tri[i]].y);
    --i; ctx.lineTo(this.points[tri[i]].x, this.points[tri[i]].y);
    ctx.closePath();
    ctx.stroke();
  }
  */


  //draw perimiter
  ctx.lineWidth = 4;
  this.points.forThree(function(prev,curr,next,i){
    if(curr.equals(next)){
      eq = eq||prev
      return;
    }
    if(eq){
      prev = eq;
      eq = false;
    }
    effectivepoints.push(curr);
    var tri = new Triangle(prev,curr,next);

    var mp = tri.getConcaveBisector();

    var badarea = false;
    if( tri.CA.pointIsLeftOrTop(mp.B) == tri.CA.pointIsLeftOrTop(tri.B)){
      ctx.strokeStyle = "#FFFF00";
      if(tri.hasPoint(_this.storedmid)){
        problem = true;
      }
    }else{
      ctx.strokeStyle = "#FF00FF";
      if(tri.partialArea < 0){
        badarea = true;
      }
    }
    var intersections = _this.points.intersectsLine(new Line(prev,curr),i);
    if(intersections.length > 0){
      //        alert("you may get a negative area here");
      intersects = intersects.concat(intersections);
    }
    ctx.beginPath();
    ctx.moveTo((prev.x+curr.x)/2, (prev.y+curr.y)/2);
    ctx.lineTo(curr.x,curr.y);
    ctx.lineTo((next.x+curr.x)/2, (next.y+curr.y)/2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(
      curr.x,
      curr.y,
      10, Math.atan(1/tri.AB.slope.slope()), Math.atan(tri.BC.slope.slope()), false
    );
    ctx.fillStyle = "#FF8300";
    ctx.fill();
  })
  ctx.lineWidth = 1;

  //intersects
  for(var i=intersects.length;i--;){
    ctx.beginPath();
    ctx.arc(
      intersects[i].x,
      intersects[i].y,
      8, 0, 2 * Math.PI, false
    );
    ctx.fillStyle = "#FF8300";
    ctx.fill();
  };

  //midpoint
  ctx.beginPath();
  ctx.arc(
    this.storedmid.x,
    this.storedmid.y,
    2, 0, 2 * Math.PI, false
  );
  ctx.fillStyle = problem?"#FF0000":"#00FF00";
  ctx.fill();
}

module.exports = AreaConstraint;

/*
A = Pir^2
P = 2Pir
P/2Pi = r
A = Pi*(P/(2Pi))^2
A = Pi/Pi^2 * P/2
A = P/2Pi

A = w*h
A/w = h
P = 2w+2h
P/2 = w+h
P/2 - w = h
A = w*(P/2 - w)
A = wP/2 - w^2
P = 2w + 2A/w

A = 1/2 * b * h
a/Sin(A) = b/Sin(b) = c/Sin(b)
b = find max side
c/Sin(90) = h/Sin(A)
Sin(A)*c/Sin(90) = h

A = 1/2 * b * Sin(A)*c/Sin(90)
P = a + b + c

So we know Area
-we know angles
Now we need to figure out the distances

a/Sin(A) = b/Sin(B) = c/Sin(C)

A = Sin(A)* Sin(C) * b^2 / (Sin(B)*Sin(90))
*/

},{"../structures/AABB":16,"../structures/Line":19,"../structures/Polygon":18,"../structures/Triangle":17,"../structures/Vec2":7}],16:[function(require,module,exports){
var Vec2 = require("./Vec2");
var Line = require("./Line");

function AABB (points){
  this.max = new Vec2().neginf();
  this.min = new Vec2().posinf();
  if(points){
    if(arguments.length > 1){
      var l = arguments.length;
      while(l--){this.digestPoint(arguments[l]);}
    }else{
      var l = points.length;
      while(l--){this.digestPoint(points[l]);}
    }
  }
}

AABB.prototype.digestPoint = function(point){
  this.max.max(point);
  this.min.min(point);
}

AABB.prototype.intersectsAABB = function(oAABB){
  if(this.min.x >= oAABB.max.x) return false;
  if(this.min.y >= oAABB.max.y) return false;
  if(oAABB.min.x >= this.max.x) return false;
  if(oAABB.min.y >= this.max.y) return false;
  return true;
}

AABB.prototype.sub = function(oAABB){
  this.min.max(oAABB.min);
  this.max.min(oAABB.max);
  return this;
}


AABB.prototype.getSuspects =function(particles){
  var lines = [];
  var inside = [];
  var done = [];
  var l = particles.length;
  var len = l;
  var xboo = false, yboo = false;
  var prev, temp, next;
  while(l--){
    xboo = (
      particles[l].pos.x <= this.max.x
    &&
      particles[l].pos.x >= this.min.x
    );
    yboo = (
      particles[l].pos.y <= this.max.y
      &&
      particles[l].pos.y >= this.min.y
    );
    if(xboo && yboo){
      temp = new Array(3);
      temp[0] = l

      prev = (l+len-1)%len;
      temp[1] = new Line(
        particles[prev].pos,
        particles[l].pos
      );
      if(done.indexOf(prev+"|"+l) == -1){
        lines.push([prev,l,temp[1]]);
        done.push(prev+"|"+l);
      }
      next = (l+1)%len;
      temp[2] = new Line(
        particles[l].pos,
        particles[next].pos
      );
      if(done.indexOf(l+"|"+next) == -1){
        lines.push([l,next,temp[2]]);
        done.push(l+"|"+next);
      }
      inside.push(temp);
      continue;
    }
    if(xboo || yboo){
      prev = (l+len-1)%len;
      if(done.indexOf(prev+"|"+l) == -1){
        temp = new Line(
          particles[prev].pos,
          particles[l].pos
        );
        if(this.intersectsLine(temp)){
          lines.push([prev,l,temp]);
        }
        done.push(prev+"|"+l)
      }
      next = (l+1)%len;
      if(done.indexOf(l+"|"+next) == -1){
        temp = new Line(
          particles[l].pos,
          particles[next].pos
        );
        if(this.intersectsLine(temp)){
          lines.push([l,next,temp]);
        }
        done.push(l+"|"+next)
      }
    }
  }
  return {inside:inside, lines:lines};
}


AABB.prototype.containsPoint = function(point){
  if(point.x >= this.max.x) return false;
  if(point.y >= this.max.y) return false;
  if(point.x <= this.min.x) return false;
  if(point.y <= this.min.y) return false;
  return true;
}

AABB.prototype.intersectsLine = function(line){
  var tline = new Line(this.max, new Vec2(this.min.x,this.max.y));
  var p = tline.intersectsLineSegment(line);
  if(p && this.containsPoint(p)) return true;
  tline = new Line(this.max, new Vec2(this.max.x,this.min.y));
  p = tline.intersectsLineSegment(line);
  if(p && this.containsPoint(p)) return true;
  tline = new Line(this.min, new Vec2(this.max.x,this.min.y));
  p = tline.intersectsLineSegment(line);
  if(p && this.containsPoint(p)) return true;
  tline = new Line(this.min, new Vec2(this.min.x,this.max.y));
  p = tline.intersectsLineSegment(line);
  if(p && this.containsPoint(p)) return true;
  return false;
}


AABB.prototype.intersectsCircle = function(c){
  if(c.containsPoint(this.max)) return true;
  if(c.containsPoint(this.min)) return true;
  if(c.containsPoint(new Vec2(this.min.x,this.max.y))) return true;
  if(c.containsPoint(new Vec2(this.max.x,this.min.y))) return true;
  return false;
}

module.exports = AABB;

},{"./Line":19,"./Vec2":7}],18:[function(require,module,exports){
function Polygon(oPoints){
  var l = oPoints.length;
  var i = l;
  var points = Array(i);
  while (i--) {
    points[l-i-1] = oPoints[i].pos||oPoints[i];
  }
  for(var i in Polygon.prototype){
    Object.defineProperty(points,i,{
      enumerable: false,
      value: Polygon.prototype[i].bind(points)
    });
  }
  Object.defineProperty(points,"clean",{
    enumerable: false,
    value: false
  });
  return points;
}

Polygon.prototype.clone = function(){
  var points = this.slice(0);
  for(var i in Polygon.prototype){
    Object.defineProperty(points,i,{
      enumerable: false,
      value:Polygon.prototype[i].bind(points)
    });
  }
  return points;
}

Polygon.prototype.forThree = function(fn,skip){
  var l = this.length;
  var i = l - (skip||0);
  while(i--){
    var prev = (i+1)%l;//((i == 0)?l:i) -1
    var curr = i;
    var next = (i+l-1)%l; //i == l-1?0:i+1
    fn.call(this,this[prev],this[curr],this[next], curr);
  }
}

var cachable = require("./cachable");
for(var i in cachable){
  Polygon.prototype[i] = cachable[i]
}
var intersects = require("./intersects");
for(var i in intersects){
  Polygon.prototype[i] = intersects[i]
}

module.exports = Polygon;

},{"./cachable":20,"./intersects":21}],19:[function(require,module,exports){
var Vec2 = require("../Vec2");


function Line(A,B){
  if(A.equals(B))
    throw new Error("cannot construct line when A == B");
  this.angledSlope = A.clone().sub(B).normalize();
  this.slope = this.angledSlope.scale(
    Math.sign(this.angledSlope.x)||Math.sign(this.angledSlope.y)
  );
  this.inv_slope = (this.slope.y == 0)?false:this.slope.x/this.slope.y;
  this.true_slope = (this.slope.x == 0)?false:this.slope.y/this.slope.x;
  this.yint = (this.true_slope !== false)?-this.true_slope*A.x + A.y:false;
  this.xint = (this.inv_slope !== false)?-this.inv_slope*A.y + A.x:false;

  this.A = A;
  this.B = B;
  this.mid = A.clone().mid(B);
  this.length2 = A.dist2(B);
  this.length = Math.sqrt(this.length2);
  this.cross = A.cross(B);
}

Line.prototype.toString = function(){
  return "limits:["+A+","+B+"]," +
  "intercepts:("+this.yint+","+thisxint+")";
  "slope:("+this.slope+"), ";
}

Line.prototype.opposite = function(){
  return this.B.y - this.A.y;
}

Line.prototype.adjacent = function(){
  return this.B.x - this.A.x;
}

Line.prototype.perpendicularBisector = function(){
  var mid = this.mid;
  var A = this.A.clone().sub(mid).swap();
  var B = A.clone();
  A.y *= -1
  B.x *= -1;
  A.add(mid);
  B.add(mid);
  return new Line(A,B);
}

var interesctions = require("./intersections.js");

for(var i in interesctions){
  Line.prototype[i] = interesctions[i];
}
var eq = require("./equals.js");

for(var i in eq){
  Line.prototype[i] = eq[i];
}

module.exports = Line;

},{"../Vec2":7,"./equals.js":23,"./intersections.js":22}],17:[function(require,module,exports){
var Vec2 = require("../Vec2");
var Line = require("../Line");


function Triangle(A,B,C){
  if(A.equals(B) || B.equals(C) || C.equals(A))
    throw new Error("cannot create triangle when two points are the same")
  this.A = A;
  this.B = B;
  this.C = C;
  this.AB = new Line(A,B);
  this.BC = new Line(B,C);
  this.CA = new Line(C,A);
  this.ABC = Math.lawCos(this.CA.length, this.AB.length, this.BC.length);
  this.BCA = Math.asin(Math.sin(this.ABC)*this.CA.length/this.AB.length);
  this.CAB = Math.asin(Math.sin(this.ABC)*this.BC.length/this.AB.length);
  this.perimiter = this.AB.length + this.BC.length + this.CA.length
  this.partialArea = this.AB.cross + this.BC.cross + this.CA.cross
  this.area = Math.abs(this.partialArea);
}


var interesctions = require("./intersections.js");

for(var i in interesctions){
  Triangle.prototype[i] = interesctions[i];
}

var questions = require("./questions.js");

for(var i in questions){
  Triangle.prototype[i] = questions[i];
}

var constructs = require("./construct.js");

for(var i in constructs){
  Triangle.prototype[i] = constructs[i];
}


module.exports = Triangle;

},{"../Line":19,"../Vec2":7,"./construct.js":26,"./intersections.js":24,"./questions.js":25}],24:[function(require,module,exports){
var Triangle = {};

Triangle.hasPoint = function(point){
  //http://www.blackpawn.com/texts/pointinpoly/
  // Compute vectors
  var v0 = this.C.clone().sub(this.B);
  var v1 = this.A.clone().sub(this.B);
  var v2 = point.clone().sub(this.B);

  // Compute dot products
  var dot00 = v0.dot(v0);
  var dot01 = v0.dot(v1);
  var dot02 = v0.dot(v2);
  var dot11 = v1.dot(v1);
  var dot12 = v1.dot(v2);

  // Compute barycentric coordinates
  var invDenom = 1 / (dot00 * dot11 - dot01 * dot01)
  var u = (dot11 * dot02 - dot01 * dot12) * invDenom
  var v = (dot00 * dot12 - dot01 * dot02) * invDenom

  // Check if point is in triangle
  return (u >= 0) && (v >= 0) && (u + v < 1)
}

module.exports = Triangle;

},{}],25:[function(require,module,exports){

var Triangle = {};

var sqrt2 = Math.pow(2,1/2);

Triangle.isConcave = function(a,b,c){
  //rotate the points around B to make B and A parrallel to the X axis
  //If the line BC is negative, it is Concave
  //If the line BC is positive, it is Convex
  var ac = new Line(a,c);
  //  A should always be rotated -PI/2
  return ac.pointIsLeftOrTop(ac.perpendicularBisector().A)
    == ac.pointIsLeftOrTop(b);
  // return Math.sign(p.x) == Math.sign(b.x) && Math.sign(p.y) == Math.sign(b.y);
}

Triangle.anglePrimer = function(){
  return this.CA.length - sqrt2*(this.AB.length+this.BC.length)/2;
}

Triangle.isAcute = function(){
  return this.anglePrimer() < 0;
}

Triangle.isObtuse = function(){
  return this.anglePrimer() > 0;
}

Triangle.isRight = function(){
  return this.anglePrimer() == 0;
}

Triangle.equals = function(tri){
  return this.A.equals(tri.A)
  && this.B.equals(tri.B)
  && this.C.equals(tri.C);
}

Triangle.epsilonEquals = function(tri, epsilon) {
  return this.A.epsilonEquals(tri.A,epsilon)
  && this.B.epsilonEquals(tri.B,epsilon)
  && this.C.epsilonEquals(tri.C,epsilon);
}

Triangle.equalShape = function(tri) {
  return this.area == tri.area && this.perimiter == tri.perimiter
}

Triangle.epsilonEqualShape = function(tri,epsilon) {
  return Math.abs(this.area - tri.area)/27 <= epsilon
  && Math.abs(this.perimiter - tri.perimiter)/9 <= epsilon;
}

Triangle.equalAngles = function(tri) {
  var keys = ["ABC","BCA", "CAB"];
  var i = 3;
  var j;
  while(i--){
    j = 3;
    while(j--){
      if(this[keys[i]] == tri[keys[i]]) break;
    }
    if(j < 0) return false;
  }
  return true;
}


module.exports = Triangle;

},{}],26:[function(require,module,exports){

var Triangle = {};

Triangle.getConcaveBisector = function(){
  return this.CA.perpendicularBisector();
}
module.exports = Triangle;
/*
Triangle.getCircumCircle = function(tri){
  var x1 = a.x,
  y1 = a.y,
  x2 = b.x,
  y2 = b.y,
  x3 = c.x,
  y3 = c.y,
  fabsy1y2 = Math.abs(y1 - y2),
  fabsy2y3 = Math.abs(y2 - y3),
  xc, yc, m1, m2, mx1, mx2, my1, my2, dx, dy;
  // Check for coincident points
  if(fabsy1y2 < EPSILON && fabsy2y3 < EPSILON){
    throw new Error("Eek! Coincident points!");
  }
  if(fabsy1y2 < EPSILON) {
    m2 = -((x3 - x2) / (y3 - y2));
    mx2 = (x2 + x3) / 2.0;
    my2 = (y2 + y3) / 2.0;
    xc = (x2 + x1) / 2.0;
    yc = m2 * (xc - mx2) + my2;
  }
  else if(fabsy2y3 < EPSILON) {
    m1 = -((x2 - x1) / (y2 - y1));
    mx1 = (x1 + x2) / 2.0;
    my1 = (y1 + y2) / 2.0;
    xc = (x3 + x2) / 2.0;
    yc = m1 * (xc - mx1) + my1;
  }
  else {
    m1 = -((x2 - x1) / (y2 - y1));
    m2 = -((x3 - x2) / (y3 - y2));
    mx1 = (x1 + x2) / 2.0;
    mx2 = (x2 + x3) / 2.0;
    my1 = (y1 + y2) / 2.0;
    my2 = (y2 + y3) / 2.0;
    xc = (m1 * mx1 - m2 * mx2 + my2 - my1) / (m1 - m2);
    yc = (fabsy1y2 > fabsy2y3) ?
    m1 * (xc - mx1) + my1 :
    m2 * (xc - mx2) + my2;
  }
  dx = x2 - xc;
  dy = y2 - yc;
  return new Circle(new Vec2(xc,yc),dx * dx + dy * dy);
}
*/

},{}],23:[function(require,module,exports){
var Line = {};

Line.equals = function(line){
  return this.A.equals(line.A)
  && this.B.equals(line.B);
}

Line.epsilonEquals = function(line, epsilon) {
  return this.A.epsilonEquals(line.A,epsilon)
  && this.B.epsilonEquals(line.B,epsilon);
}

Line.equalSlope = function(line) {
  return this.slope.equals(line.slope)
  && (this.xint)?this.xint == line.xint
  :this.yint == line.yint;
}

Line.epsilonEqualSlope = function(line, epsilon) {
  return this.slope.epsilonEquals(line.slope,epsilon)
  && (this.xint)?Math.abs(this.xint - line.xint) <= epsilon
  :Math.abs(this.yint - line.yint) <= epsilon
}

Line.equalMagnitude = function(line) {
  return this.slope.equals(line.slope)
  && this.length == line.length
}

Line.epsilonEqualMagnitude = function(line, epsilon) {
  return this.slope.epsilonEquals(line.slope,epsilon)
  && Math.abs(this.length - line.length) <= epsilon
}


module.exports =  Line;

},{}],22:[function(require,module,exports){
var Vec2 = require("../Vec2");
var Line = {};

Line.intersectsLine = function(lineB){
  var lineA = this;
  if(lineA.slope.equals(lineB.slope)) return false;

  var intersect = new Vec2();
  //lineA should take care of any special conditions
  if(lineA.slope.x === 0 || lineB.slope.x === 0){
    if(lineA.slope.y === 0 || lineB.slope.y === 0){
      return new Vec2(
        (lineA.slope.x === 0)?lineA.xint:lineB.xint,
        (lineA.slope.y === 0)?lineA.yint:lineB.yint
      );
    }
    //I don't care which one is which 0
    //calculate in respect to X
    intersect.y = (lineA.xint-lineB.xint)/(lineB.inv_slope-lineA.inv_slope);
    intersect.x = lineA.inv_slope*intersect.y + lineA.xint;
  }else{
    intersect.x = (lineA.yint-lineB.yint)/(lineB.true_slope-lineA.true_slope);
    intersect.y = lineA.true_slope*intersect.x + lineA.yint;
  }
  return intersect;
}

Line.intersectsLineSegment = function(line){
  var intersect = this.intersectsLine(line);
  if(!intersect) return false;
  if(!(new Vec2().posinf().min(this.A).min(this.B).max(intersect).equals(intersect)))
    return false;
  if(!(new Vec2().neginf().max(this.A).max(this.B).min(intersect).equals(intersect)))
    return false;
  if(!(new Vec2().posinf().min(line.A).min(line.B).max(intersect).equals(intersect)))
    return false;
  if(!(new Vec2().neginf().max(line.A).max(line.B).min(intersect).equals(intersect)))
    return false;
  return intersect;
}

Line.pointIsLeftOrTop = function(p){
  //get slopes of the lines
  //see if a ray cast from 0,0 intersects it
  return this.B.clone().sub(this.A).cross(p.clone().sub(this.A)) < 0;
};

Line.intersectsPoint = function(p){
  if(!this.slope.x) return this.xint == p.x;
  return p.y == p.x*this.slope.slope() + this.yint;
};

module.exports = Line;

},{"../Vec2":7}],21:[function(require,module,exports){
var AABB = require("../AABB")
var Line = require("../Line");
var Polygon = {};

Polygon.intersectsLine = function(line,skip){
  //creating smaller aabbs
  //We're going to detect intersection by slope
  //however, the point of intersection may be outside of the of the possible area
  //as a result we're creating a smaller aabb thats the maxes and minimums of the current area

  var tAABB = new AABB(line.A,line.B);

  var intersections = [];

  this.forThree(function(oprev,ocurr,onext){
    if(line.A == ocurr) return;
    if(line.B == oprev) return;
    if(oprev == line.A) return;
    var oAABB = new AABB(oprev,ocurr);

    if(!tAABB.intersectsAABB(oAABB)) return;

    //I would like to cache the oprev->ocurr line if possible
    //I would also prefer searching only for lines with the appropiate AABBs
    var intersect = line.intersectsLine(new Line(oprev,ocurr));
    if(!intersect) return;

    var netAABB = {
      max: oAABB.max.min(tAABB.max),
      min: oAABB.min.max(tAABB.min)
    };
    //If intersect point isn't between the two points, this isn't for us.
    if(!tAABB.containsPoint(intersect)) return;

    intersections.push(intersect);

  },skip);
  return intersections;
}
module.exports = Polygon;

},{"../AABB":16,"../Line":19}],20:[function(require,module,exports){
var Vec2 = require("../Vec2");
var Delaney = require("delaunay-fast")


var Polygon = {};

Polygon.getMidPoint = function(){
  var l = this.length;
  var mid = new Vec2();
  for(var i=this.length;i--;){
    mid.add(this[i].clone().scale(1/l));
  };
  return mid;
}

Polygon.getArea = function(){
  var net = 0;
  //http://www.wikihow.com/Calculate-the-Area-of-a-Polygon
  this.forThree(function(a,b,c){
    net += b.cross(c);
  })
  return net;
}

Polygon.getAABB = function(){
  var max = new Vec2(Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY);
  var min = new Vec2(Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY);
  for(var i=this.length;i--;){
    max.max(this[i]);
    min.min(this[i]);
  }
  return {max:max,min:min};
}

Polygon.getDelaney = function(){
  return Delaney.triangulate(this,"asArray");
}
module.exports = Polygon

},{"../Vec2":7,"delaunay-fast":27}],27:[function(require,module,exports){
var Delaunay;

(function() {
  "use strict";

  var EPSILON = 1.0 / 1048576.0;

  function supertriangle(vertices) {
    var xmin = Number.POSITIVE_INFINITY,
        ymin = Number.POSITIVE_INFINITY,
        xmax = Number.NEGATIVE_INFINITY,
        ymax = Number.NEGATIVE_INFINITY,
        i, dx, dy, dmax, xmid, ymid;

    for(i = vertices.length; i--; ) {
      if(vertices[i][0] < xmin) xmin = vertices[i][0];
      if(vertices[i][0] > xmax) xmax = vertices[i][0];
      if(vertices[i][1] < ymin) ymin = vertices[i][1];
      if(vertices[i][1] > ymax) ymax = vertices[i][1];
    }

    dx = xmax - xmin;
    dy = ymax - ymin;
    dmax = Math.max(dx, dy);
    xmid = xmin + dx * 0.5;
    ymid = ymin + dy * 0.5;

    return [
      [xmid - 20 * dmax, ymid -      dmax],
      [xmid            , ymid + 20 * dmax],
      [xmid + 20 * dmax, ymid -      dmax]
    ];
  }

  function circumcircle(vertices, i, j, k) {
    var x1 = vertices[i][0],
        y1 = vertices[i][1],
        x2 = vertices[j][0],
        y2 = vertices[j][1],
        x3 = vertices[k][0],
        y3 = vertices[k][1],
        fabsy1y2 = Math.abs(y1 - y2),
        fabsy2y3 = Math.abs(y2 - y3),
        xc, yc, m1, m2, mx1, mx2, my1, my2, dx, dy;

    /* Check for coincident points */
    if(fabsy1y2 < EPSILON && fabsy2y3 < EPSILON)
      throw new Error("Eek! Coincident points!");

    if(fabsy1y2 < EPSILON) {
      m2  = -((x3 - x2) / (y3 - y2));
      mx2 = (x2 + x3) / 2.0;
      my2 = (y2 + y3) / 2.0;
      xc  = (x2 + x1) / 2.0;
      yc  = m2 * (xc - mx2) + my2;
    }

    else if(fabsy2y3 < EPSILON) {
      m1  = -((x2 - x1) / (y2 - y1));
      mx1 = (x1 + x2) / 2.0;
      my1 = (y1 + y2) / 2.0;
      xc  = (x3 + x2) / 2.0;
      yc  = m1 * (xc - mx1) + my1;
    }

    else {
      m1  = -((x2 - x1) / (y2 - y1));
      m2  = -((x3 - x2) / (y3 - y2));
      mx1 = (x1 + x2) / 2.0;
      mx2 = (x2 + x3) / 2.0;
      my1 = (y1 + y2) / 2.0;
      my2 = (y2 + y3) / 2.0;
      xc  = (m1 * mx1 - m2 * mx2 + my2 - my1) / (m1 - m2);
      yc  = (fabsy1y2 > fabsy2y3) ?
        m1 * (xc - mx1) + my1 :
        m2 * (xc - mx2) + my2;
    }

    dx = x2 - xc;
    dy = y2 - yc;
    return {i: i, j: j, k: k, x: xc, y: yc, r: dx * dx + dy * dy};
  }

  function dedup(edges) {
    var i, j, a, b, m, n;

    for(j = edges.length; j; ) {
      b = edges[--j];
      a = edges[--j];

      for(i = j; i; ) {
        n = edges[--i];
        m = edges[--i];

        if((a === m && b === n) || (a === n && b === m)) {
          edges.splice(j, 2);
          edges.splice(i, 2);
          break;
        }
      }
    }
  }

  Delaunay = {
    triangulate: function(vertices, key) {
      var n = vertices.length,
          i, j, indices, st, open, closed, edges, dx, dy, a, b, c;

      /* Bail if there aren't enough vertices to form any triangles. */
      if(n < 3)
        return [];

      /* Slice out the actual vertices from the passed objects. (Duplicate the
       * array even if we don't, though, since we need to make a supertriangle
       * later on!) */
      vertices = vertices.slice(0);

      if(key)
        for(i = n; i--; )
          vertices[i] = vertices[i][key];

      /* Make an array of indices into the vertex array, sorted by the
       * vertices' x-position. */
      indices = new Array(n);

      for(i = n; i--; )
        indices[i] = i;

      indices.sort(function(i, j) {
        return vertices[j][0] - vertices[i][0];
      });

      /* Next, find the vertices of the supertriangle (which contains all other
       * triangles), and append them onto the end of a (copy of) the vertex
       * array. */
      st = supertriangle(vertices);
      vertices.push(st[0], st[1], st[2]);
      
      /* Initialize the open list (containing the supertriangle and nothing
       * else) and the closed list (which is empty since we havn't processed
       * any triangles yet). */
      open   = [circumcircle(vertices, n + 0, n + 1, n + 2)];
      closed = [];
      edges  = [];

      /* Incrementally add each vertex to the mesh. */
      for(i = indices.length; i--; edges.length = 0) {
        c = indices[i];

        /* For each open triangle, check to see if the current point is
         * inside it's circumcircle. If it is, remove the triangle and add
         * it's edges to an edge list. */
        for(j = open.length; j--; ) {
          /* If this point is to the right of this triangle's circumcircle,
           * then this triangle should never get checked again. Remove it
           * from the open list, add it to the closed list, and skip. */
          dx = vertices[c][0] - open[j].x;
          if(dx > 0.0 && dx * dx > open[j].r) {
            closed.push(open[j]);
            open.splice(j, 1);
            continue;
          }

          /* If we're outside the circumcircle, skip this triangle. */
          dy = vertices[c][1] - open[j].y;
          if(dx * dx + dy * dy - open[j].r > EPSILON)
            continue;

          /* Remove the triangle and add it's edges to the edge list. */
          edges.push(
            open[j].i, open[j].j,
            open[j].j, open[j].k,
            open[j].k, open[j].i
          );
          open.splice(j, 1);
        }

        /* Remove any doubled edges. */
        dedup(edges);

        /* Add a new triangle for each edge. */
        for(j = edges.length; j; ) {
          b = edges[--j];
          a = edges[--j];
          open.push(circumcircle(vertices, a, b, c));
        }
      }

      /* Copy any remaining open triangles to the closed list, and then
       * remove any triangles that share a vertex with the supertriangle,
       * building a list of triplets that represent triangles. */
      for(i = open.length; i--; )
        closed.push(open[i]);
      open.length = 0;

      for(i = closed.length; i--; )
        if(closed[i].i < n && closed[i].j < n && closed[i].k < n)
          open.push(closed[i].i, closed[i].j, closed[i].k);

      /* Yay, we're done! */
      return open;
    },
    contains: function(tri, p) {
      /* Bounding box test first, for quick rejections. */
      if((p[0] < tri[0][0] && p[0] < tri[1][0] && p[0] < tri[2][0]) ||
         (p[0] > tri[0][0] && p[0] > tri[1][0] && p[0] > tri[2][0]) ||
         (p[1] < tri[0][1] && p[1] < tri[1][1] && p[1] < tri[2][1]) ||
         (p[1] > tri[0][1] && p[1] > tri[1][1] && p[1] > tri[2][1]))
        return null;

      var a = tri[1][0] - tri[0][0],
          b = tri[2][0] - tri[0][0],
          c = tri[1][1] - tri[0][1],
          d = tri[2][1] - tri[0][1],
          i = a * d - b * c;

      /* Degenerate tri. */
      if(i === 0.0)
        return null;

      var u = (d * (p[0] - tri[0][0]) - b * (p[1] - tri[0][1])) / i,
          v = (a * (p[1] - tri[0][1]) - c * (p[0] - tri[0][0])) / i;

      /* If we're outside the tri, fail. */
      if(u < 0.0 || v < 0.0 || (u + v) > 1.0)
        return null;

      return [u, v];
    }
  };

  if(typeof module !== "undefined")
    module.exports = Delaunay;
})();

},{}]},{},[1])
;