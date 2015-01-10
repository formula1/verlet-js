;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){

//this exports all the verlet methods globally, so that the demos work.

var VerletDraw = require('./verlet-draw')
var VerletJS = require('./verlet')
var constraint = require('./constraint')
								 require('./objects') //patches VerletJS.prototype (bad)
window.Vec2 = require('./structures/Vec2')
window.VerletJS = VerletJS
window.VerletDraw = VerletDraw;

window.Particle = VerletJS.Particle

window.DistanceConstraint = constraint.DistanceConstraint
window.PinConstraint      = constraint.PinConstraint
window.AngleConstraint    = constraint.AngleConstraint
window.AreaConstraint    = constraint.AreaConstraint

},{"./constraint":4,"./objects":5,"./structures/Vec2":6,"./verlet":3,"./verlet-draw":2}],6:[function(require,module,exports){

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
}

Vec2.prototype.add = function(v) {
	return new Vec2(this.x + v.x, this.y + v.y);
}

Vec2.prototype.sub = function(v) {
	return new Vec2(this.x - v.x, this.y - v.y);
}

Vec2.prototype.mul = function(v) {
	return new Vec2(this.x * v.x, this.y * v.y);
}

Vec2.prototype.div = function(v) {
	return new Vec2(this.x / v.x, this.y / v.y);
}

Vec2.prototype.scale = function(coef) {
	return new Vec2(this.x*coef, this.y*coef);
}

Vec2.prototype.mutableSet = function(v) {
	this.x = v.x;
	this.y = v.y;
	return this;
}

Vec2.prototype.mutableAdd = function(v) {
	this.x += v.x;
	this.y += v.y;
	return this;
}

Vec2.prototype.mutableSub = function(v) {
	this.x -= v.x;
	this.y -= v.y;
	return this;
}

Vec2.prototype.mutableMul = function(v) {
	this.x *= v.x;
	this.y *= v.y;
	return this;
}

Vec2.prototype.mutableDiv = function(v) {
	this.x /= v.x;
	this.y /= v.y;
	return this;
}

Vec2.prototype.mutableScale = function(coef) {
	this.x *= coef;
	this.y *= coef;
	return this;
}

Vec2.prototype.equals = function(v) {
	return this.x == v.x && this.y == v.y;
}

Vec2.prototype.epsilonEquals = function(v, epsilon) {
	return Math.abs(this.x - v.x) <= epsilon && Math.abs(this.y - v.y) <= epsilon;
}

Vec2.prototype.length = function(v) {
	return Math.sqrt(this.x*this.x + this.y*this.y);
}

Vec2.prototype.length2 = function(v) {
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

Vec2.prototype.normal = function() {
	var m = Math.sqrt(this.x*this.x + this.y*this.y);
	return new Vec2(this.x/m, this.y/m);
}

Vec2.prototype.dot = function(v) {
	return this.x*v.x + this.y*v.y;
}

Vec2.prototype.angle = function(v) {
	return Math.atan2(this.x*v.y-this.y*v.x,this.x*v.x+this.y*v.y);
}

Vec2.prototype.angle2 = function(vLeft, vRight) {
	return vLeft.sub(this).angle(vRight.sub(this));
}

Vec2.prototype.rotate = function(origin, theta) {
	var x = this.x - origin.x;
	var y = this.y - origin.y;
	return new Vec2(x*Math.cos(theta) - y*Math.sin(theta) + origin.x, x*Math.sin(theta) + y*Math.cos(theta) + origin.y);
}

Vec2.prototype.toString = function() {
	return "(" + this.x + ", " + this.y + ")";
}
//=============================================================

Vec2.prototype.cross = function(v){
	return this.x * v.y - this.y * v.x;
}

Vec2.prototype.min = function(v){
	return new Vec2(
		Math.min(this.x, v.x),
		Math.min(this.y, v.y)
	);
}

Vec2.prototype.max = function(v){
	return new Vec2(
		Math.max(this.x, v.x),
		Math.max(this.y, v.y)
	);
}

//=============================================================



function test_Vec2() {
	var assert = function(label, expression) {
		console.log("Vec2(" + label + "): " + (expression == true ? "PASS" : "FAIL"));
		if (expression != true)
			throw "assertion failed";
	};

	assert("equality", (new Vec2(5,3).equals(new Vec2(5,3))));
	assert("epsilon equality", (new Vec2(1,2).epsilonEquals(new Vec2(1.01,2.02), 0.03)));
	assert("epsilon non-equality", !(new Vec2(1,2).epsilonEquals(new Vec2(1.01,2.02), 0.01)));
	assert("addition", (new Vec2(1,1)).add(new Vec2(2, 3)).equals(new Vec2(3, 4)));
	assert("subtraction", (new Vec2(4,3)).sub(new Vec2(2, 1)).equals(new Vec2(2, 2)));
	assert("multiply", (new Vec2(2,4)).mul(new Vec2(2, 1)).equals(new Vec2(4, 4)));
	assert("divide", (new Vec2(4,2)).div(new Vec2(2, 2)).equals(new Vec2(2, 1)));
	assert("scale", (new Vec2(4,3)).scale(2).equals(new Vec2(8, 6)));
	assert("mutable set", (new Vec2(1,1)).mutableSet(new Vec2(2, 3)).equals(new Vec2(2, 3)));
	assert("mutable addition", (new Vec2(1,1)).mutableAdd(new Vec2(2, 3)).equals(new Vec2(3, 4)));
	assert("mutable subtraction", (new Vec2(4,3)).mutableSub(new Vec2(2, 1)).equals(new Vec2(2, 2)));
	assert("mutable multiply", (new Vec2(2,4)).mutableMul(new Vec2(2, 1)).equals(new Vec2(4, 4)));
	assert("mutable divide", (new Vec2(4,2)).mutableDiv(new Vec2(2, 2)).equals(new Vec2(2, 1)));
	assert("mutable scale", (new Vec2(4,3)).mutableScale(2).equals(new Vec2(8, 6)));
	assert("length", Math.abs((new Vec2(4,4)).length() - 5.65685) <= 0.00001);
	assert("length2", (new Vec2(2,4)).length2() == 20);
	assert("dist", Math.abs((new Vec2(2,4)).dist(new Vec2(3,5)) - 1.4142135) <= 0.000001);
	assert("dist2", (new Vec2(2,4)).dist2(new Vec2(3,5)) == 2);

	var normal = (new Vec2(2,4)).normal()
	assert("normal", Math.abs(normal.length() - 1.0) <= 0.00001 && normal.epsilonEquals(new Vec2(0.4472, 0.89443), 0.0001));
	assert("dot", (new Vec2(2,3)).dot(new Vec2(4,1)) == 11);
	assert("angle", (new Vec2(0,-1)).angle(new Vec2(1,0))*(180/Math.PI) == 90);
	assert("angle2", (new Vec2(1,1)).angle2(new Vec2(1,0), new Vec2(2,1))*(180/Math.PI) == 90);
	assert("rotate", (new Vec2(2,0)).rotate(new Vec2(1,0), Math.PI/2).equals(new Vec2(1,1)));
	assert("toString", (new Vec2(2,4)) == "(2, 4)");
}

},{}],2:[function(require,module,exports){

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
      _this.draggedEntity.pos.mutableSet(_this.mouse);
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

},{"./verlet.js":3}],3:[function(require,module,exports){

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

			// calculate velocity
			var velocity = particles[i].pos.sub(particles[i].lastPos).scale(this.friction);

			// ground friction
			if (particles[i].pos.y >= this.height-1 && velocity.length2() > 0.000001) {
				var m = velocity.length();
				velocity.x /= m;
				velocity.y /= m;
				velocity.mutableScale(m*this.groundFriction);
			}

			// save last good state
			particles[i].lastPos.mutableSet(particles[i].pos);

			// gravity
			particles[i].pos.mutableAdd(this.gravity);

			// inertia
			particles[i].pos.mutableAdd(velocity);
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

},{"./structures/Composite":8,"./structures/Particle":7,"./structures/Vec2":6}],4:[function(require,module,exports){

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
exports.AreaConstraint = require("./constraints/AreaConstraint");

},{"./constraints/AngleConstraint":11,"./constraints/AreaConstraint":12,"./constraints/DistanceConstraint":9,"./constraints/PinConstraint":10,"./structures/Vec2":6}],5:[function(require,module,exports){

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
		);
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

},{"./constraint":4,"./verlet":3}],8:[function(require,module,exports){

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

},{}],9:[function(require,module,exports){
function DistanceConstraint(a, b, stiffness, distance /*optional*/) {
  this.a = a;
  this.b = b;
  this.distance = typeof distance != "undefined" ? distance : a.pos.sub(b.pos).length();
  this.stiffness = stiffness;
}

DistanceConstraint.prototype.relax = function(stepCoef) {
  var normal = this.a.pos.sub(this.b.pos);
  var m = normal.length2();
  normal.mutableScale(((this.distance*this.distance - m)/m)*this.stiffness*stepCoef);
  this.a.pos.mutableAdd(normal);
  this.b.pos.mutableSub(normal);
}

DistanceConstraint.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.moveTo(this.a.pos.x, this.a.pos.y);
  ctx.lineTo(this.b.pos.x, this.b.pos.y);
  ctx.strokeStyle = "#d8dde2";
  ctx.stroke();
}

module.exports = DistanceConstraint;

},{}],11:[function(require,module,exports){
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

    this.a.pos = this.a.pos.rotate(this.b.pos, diff);
    this.c.pos = this.c.pos.rotate(this.b.pos, -diff);
    this.b.pos = this.b.pos.rotate(this.a.pos, diff);
    this.b.pos = this.b.pos.rotate(this.c.pos, -diff);
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

},{}],7:[function(require,module,exports){
var Vec2 = require("./Vec2")

function Particle(pos) {
  this.pos = (new Vec2()).mutableSet(pos);
  this.lastPos = (new Vec2()).mutableSet(pos);
  var _this = this;
  Object.defineProperty(this,"x",{
    get:function(){
      return _this.pos.x;
    },
    set:function(ny){
      _this.pos.x = nx;
    }
  })
  Object.defineProperty(this,"y",{
    get:function(){
      return _this.pos.y;
    },
    set:function(ny){
      _this.pos.y = ny;
    }
  })
}

Particle.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.arc(this.pos.x, this.pos.y, 2, 0, 2*Math.PI);
  ctx.fillStyle = "#2dad8f";
  ctx.fill();
}


module.exports = Particle;

},{"./Vec2":6}],10:[function(require,module,exports){
var Vec2 = require("../structures/Vec2")

function PinConstraint(a, pos) {
  this.a = a;
  this.pos = (new Vec2()).mutableSet(pos);
}

PinConstraint.prototype.relax = function(stepCoef) {
  this.a.pos.mutableSet(this.pos);
}

PinConstraint.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.arc(this.pos.x, this.pos.y, 6, 0, 2*Math.PI);
  ctx.fillStyle = "rgba(0,153,255,0.1)";
  ctx.fill();
}

module.exports = PinConstraint;

},{"../structures/Vec2":6}],12:[function(require,module,exports){
var Vec2 = require("../structures/Vec2");
var Polygon = require("../structures/Polygon");


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
    area += curr.pos.cross(next.pos);
    mid.mutableAdd(curr.pos.scale(1/l))
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

  //I want to have all points to either push away from the mid or towards the mid
  //The extremity is dependent on the distance
  //Get the distance between mid and point
  //make the distance the appropriate proportion
  this.storedarea = 0;
  this.storedmid = new Vec2();


  var _this = this;
  this.points.forThree(function(prev,curr,next){
    var dist = curr.pos.sub(mid);
    dist = dist.scale(Math.sqrt(diff));
    dist = mid.add(dist);
    curr.pos = dist;
    if(curr != _this.points[0]){
      _this.storedarea += prev.pos.cross(curr.pos);
    }
    _this.storedmid.mutableAdd(curr.pos.scale(1/l));
  })
  _this.storedarea += this.points[l-1].pos.cross(this.points[0].pos);
}
AreaConstraint.prototype.draw = function(ctx) {
  var diff = Math.floor(Math.min(255,255*this.area/this.storedarea));
  var inv = Math.floor(Math.min(255,255*this.storedarea/this.area));
  ctx.beginPath();
  ctx.moveTo(this.points["0"].pos.x, this.points["0"].pos.y);
  var _this = this;
  var problem = false;
  var intersects = [];
  this.points.forThree(function(prev,curr,next,i){
    if(Polygon.triangleIsConcave(prev,curr,next)){
      ctx.strokeStyle="#FF0000";
      if(Polygon.triangleHasPoint(prev,curr,next,_this.storedmid)){
        problem = true;
      }
    }else{
      ctx.strokeStyle="#FFFFFF";
    }
    intersects = intersects.concat(_this.points.getIntersects(prev,curr,i));
    ctx.lineTo(curr.pos.x,curr.pos.y);
  })

  var g = (diff < inv)?diff:inv;
  ctx.closePath();
  ctx.fillStyle="rgba("+diff+","+g+","+inv+",0.6)";
  ctx.fill();

  intersects.forEach(function(point){
    console.log(point);
    ctx.beginPath();
    ctx.arc(
      point.x,
      point.y,
      8, 0, 2 * Math.PI, false
    );
    ctx.fillStyle = "#FF8300";
    ctx.fill();
  });

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

},{"../structures/Polygon":13,"../structures/Vec2":6}],13:[function(require,module,exports){

var Vec2 = require("./Vec2");
var Line = require("./Line");

function Polygon(points){
  if(arguments.length == 0){
    points = [];
  }
  if(!Array.isArray(points)){
    if(arguments.length > 1){
      points = Array.prototype.slice.call(arguments,0);
    }else{
      throw new Error("arguments must either be >=3 or an Array that is >= 3");
    }
  }
  if(points.length < 3) throw new Error("point groups must be a minimum of 3");
  if(points instanceof Polygon)
    return points;
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
  for(var i=skip||0;i<l;i++){
    var prev = (i+l-1)%l;//((i == 0)?l:i) -1
    var curr = i;
    var next = (i+1)%l; //i == l-1?0:i+1
    fn(this[prev],this[curr],this[next], curr);
  }
}

Polygon.prototype.getIntersects = function(tprev,tcurr,skip){
  //creating smaller aabbs
  //We're going to detect intersection by slope
  //however, the point of intersection may be outside of the of the possible area
  //as a result we're creating a smaller aabb thats the maxes and minimums of the current area

  var tAABB = {
    max: tprev.pos.max(tcurr.pos),
    min: tprev.pos.min(tcurr.pos)
  };
  var tAB_line = new Line(tprev,tcurr);

  var intersections = [];

  this.forThree(function(oprev,ocurr,onext){
    if(tcurr.pos.equals(ocurr.pos)) return;
    if(tcurr.pos.equals(oprev.pos)) return;
    if(oprev.pos.equals(tcurr.pos)) return;
    var oAABB = {
      max: oprev.pos.max(ocurr.pos),
      min: oprev.pos.min(ocurr.pos)
    };

    if(tAABB.min.x >= oAABB.max.x) return;
    if(tAABB.min.y >= oAABB.max.y) return;
    if(oAABB.min.x >= tAABB.max.x) return;
    if(oAABB.min.y >= tAABB.max.y) return;

    //I would like to cache the oprev->ocurr line if possible
    //I would also prefer searching only for lines with the appropiate AABBs
    var intersect = tAB_line.getIntersection(oprev,ocurr);
    if(!intersect) return;

    var netAABB = {
      max: oAABB.max.min(tAABB.max),
      min: oAABB.min.max(tAABB.min)
    };
    //If intersect point isn't between the two points, this isn't for us.
    if(intersect.x >= netAABB.max.x) return;
    if(intersect.y >= netAABB.max.y) return;
    if(intersect.x <= netAABB.min.x) return;
    if(intersect.y <= netAABB.min.y) return;

    intersections.push(intersect);

  },skip);

  return intersections;
}

Polygon.prototype.getMidPoint = function(){
  var l = points.length;
  var mid = new Vec2();
  //http://www.wikihow.com/Calculate-the-Area-of-a-Polygon
  this.forEach(function(point){
    mid = mid.add(point.pos.scale(1/l));
  })
  return mid;
}

Polygon.prototype.getArea = function(){
  var net = 0;
  //http://www.wikihow.com/Calculate-the-Area-of-a-Polygon
  this.forThree(function(a,b,c){
    net += b.pos.cross(c.pos);
  })
  return net;
}

Polygon.prototype.getAABB = function(){
  var max = new Vec2(-Number.Infinity,-Number.Infinity);
  var min = new Vec2(Number.Infinity,Number.Infinity);
  this.forEach(function(point){
    if(point.x < min.x) min.x = point.x;
    else if(point.x > max.x) max.x = point.x;
    if(point.y < min.y) min.y = point.y;
    else if(point.y > max.y) max.y = point.y
  })
  return {max:max,min:min};
}

Polygon.triangleHasPoint = function(a,b,c,point){
  //http://www.blackpawn.com/texts/pointinpoly/
  // Compute vectors
  var v0 = c.pos.sub(b.pos);
  var v1 = a.pos.sub(b.pos);
  var v2 = point.sub(b.pos);

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

Polygon.triangleIsConcave = function(a,b,c){
  //rotate the points around B to make B and A parrallel to the X axis
  //If the line BC is negative, it is Concave
  //If the line BC is positive, it is Convex

  var ABhyp = a.pos.dist(b.pos);
  var ABopp = b.pos.y - a.pos.y

  var ABrotate = Math.asin(ABopp/ABhyp);
  var Anew = a.pos.rotate(b.pos,ABrotate);
  var Cnew = c.pos.rotate(b.pos,ABrotate);

  ACadj = c.pos.x - a.pos.x;
  ACopp = c.pos.y - a.pos.y;
  if(ACadj == 0){
    //We are also considering if they are the exact same point to be concave
    return (ACopp < 0)
  }
  //We are also considering straight line to be convex
  return (ACopp/ACadj > 0);
}


module.exports = Polygon;

},{"./Line":14,"./Vec2":6}],14:[function(require,module,exports){


function Line(points){

  if(arguments.length > 2) throw new Error("can only accept 2 or less arguments");
  if(arguments.length == 2){
    points = Array.prototype.slice.call(arguments,0);
  }else if(arguments.length == 1){
    if(!Array.isArray(points)){
      throw new Error("If you are only providing a single Argument, it must be an array");
    }
  }else{
    throw new Error("When constructing a line, must have 2 points");
  }
  this.slope = points[0].pos.sub(points[1].pos);
  this.inv_slope = (this.slope.y == 0)?false:this.slope.x/this.slope.y;
  this.true_slope = (this.slope.x == 0)?false:this.slope.y/this.slope.x;
  this.yint = -this.true_slope*points[0].x + points[0].y
  this.xint = -this.inv_slope*points[0].y + points[0].x
}

Line.prototype.getIntersection = function(B1,B2){
  var slopeB = B1.pos.sub(B2.pos);

  // unlikely
  if(this.slope.equals(slopeB)) return false;

  var intersect = new Vec2();
  //This should take care of any special conditions
  if(this.slope.x === 0 || slopeB.x === 0){
    if(this.slope.x == slopeB.x) return false;
    if(this.slope.y === 0 || slopeB.y === 0){
      return new Vec2(
        (this.slope.x === 0)?this.xint:B1.x,
        (this.slope.y === 0)?this.yint:B1.y
      );
    }

    //I don't care which one is which
    var true_slope_A = this.inv_slope;
    var true_slope_B = slopeB.x/slopeB.y;
    //calculate in respect to X
    var bA = this.xint;
    var bB = -true_slope_B*B1.y + B1.x;
    intersect.y = (bA-bB)/(true_slope_B-true_slope_A);
    intersect.x = true_slope_A*intersect.y + bA;
  }else{
    var true_slope_A = this.true_slope;
    var true_slope_B = slopeB.y/slopeB.x;
    if(true_slope_A == true_slope_B) return false;
    var bA = this.yint;
    var bB = -true_slope_B*B1.x + B1.y;
    intersect.x = (bA-bB)/(true_slope_B-true_slope_A);
    intersect.y = true_slope_A*intersect.x + bA;
  }
  return intersect;

}


Line.getIntersection = function(A1,A2,B1,B2){
  var slopeA = A1.pos.sub(A2.pos);
  var slopeB = B1.pos.sub(B2.pos);

  // unlikely
  if(slopeA.equals(slopeB)) return false;

  var intersect = new Vec2();
  //This should take care of any special conditions
  if(slopeA.x == 0 || slopeB.x == 0){
    if(slopeA.x == slopeB.x) return false;
    if(slopeA.y == 0 || slopeB.y == 0){
      return new Vec2(
        (slopeA.x == 0)?A1.x:B1.x,
        (slopeA.y == 0)?A1.y:B1.y
      );
    }

    //I don't care which one is which
    var true_slope_A = slopeA.x/slopeA.y;
    var true_slope_B = slopeB.x/slopeB.y;
    //calculate in respect to X
    var bA = -true_slope_A*A1.y + A1.x;
    var bB = -true_slope_B*B1.y + B1.x;
    intersect.y = (bA-bB)/(true_slope_B-true_slope_A);
    intersect.x = true_slope_A*intersect.y + bA;
  }else{
    var true_slope_A = slopeA.y/slopeA.x;
    var true_slope_B = slopeB.y/slopeB.x;
    if(true_slope_A == true_slope_B) return false;
    var bA = -true_slope_A*A1.x + A1.y;
    var bB = -true_slope_B*B1.x + B1.y;
    intersect.x = (bA-bB)/(true_slope_B-true_slope_A);
    intersect.y = true_slope_A*intersect.x + bA;
  }
  return intersect;

}

module.exports = Line;

},{}]},{},[1])
;