;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){

//this exports all the verlet methods globally, so that the demos work.

var VerletDraw = require('./verlet-draw')
var VerletJS = require('./verlet')
var constraint = require('./constraint')
								 require('./objects') //patches VerletJS.prototype (bad)
window.Vec2 = require('./vec2')
window.VerletJS = VerletJS
window.VerletDraw = VerletDraw;

window.Particle = VerletJS.Particle

window.DistanceConstraint = constraint.DistanceConstraint
window.PinConstraint      = constraint.PinConstraint
window.AngleConstraint    = constraint.AngleConstraint
window.AreaConstraint    = constraint.AreaConstraint

},{"./constraint":4,"./objects":5,"./vec2":6,"./verlet":3,"./verlet-draw":2}],4:[function(require,module,exports){

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

exports.DistanceConstraint = DistanceConstraint
exports.PinConstraint = PinConstraint
exports.AngleConstraint = AngleConstraint
exports.AreaConstraint = AreaConstraint

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
	this.points = points;
	this.area = AreaConstraint.calculateArea_Mid(this.points).area;
	if(this.area == 0){
		throw new Error("cannot calculate a nonexistant area");
	}
	this.stiffness = stiffness;
}

AreaConstraint.calculateArea_Mid = function(points){
	var net = 0;
	var mid = new Vec2();
	var l = points.length;
	for(var i=0;i<l;i++){
		net += points[i].pos.x * points[(i+1)%l].pos.y - points[i].pos.y * points[(i+1)%l].pos.x;
		mid = mid.add(points[i].pos.scale(1/l));
	}
	if(net < 0) throw new Error("negative area");
	return {area:net,mid:mid};
}

AreaConstraint.prototype.relax = function(stepCoef) {
	var am = AreaConstraint.calculateArea_Mid(this.points);
	var diff = (this.area*(this.stiffness*stepCoef) + (1-this.stiffness*stepCoef)*am.area)/am.area;

	//I have the two areas
	//I want to have all points to either push away from the mid or towards the mid
	//The extremity is dependent on the distance
	//Get the distance between mid and point
	//make the distance the appropriate proportion


	//finding half the area of a circle
	// A = pi * r^2
	// A/2 = pi/2 * r^2
	// dA = pi/d * r^2
	// we know current area
	// we know desired area
	// (dA/cA) * cA = (dA/cA) * pi * r^2
	// we're looking for the change in r that corresponds to change in A
	// sqrt(A/pi) = r


	// we find the porportion between cur and desired
	// multiply current distance by that porportion

//	diff = 1/Math.sqrt(diff);
//	diff *= stepCoef*this.stiffness;

	for(var i in this.points){
		var dist = this.points[i].pos.sub(am.mid);
		dist = dist.scale(Math.sqrt(diff));
		dist = am.mid.add(dist);
		this.points[i].pos = dist;
	}
}

AreaConstraint.prototype.draw = function(ctx) {
	var am = AreaConstraint.calculateArea_Mid(this.points);
	var diff = Math.floor(Math.min(255,255*this.area/am.area));
	var inv = Math.floor(Math.min(255,255*am.area/this.area));
	ctx.beginPath();
	ctx.moveTo(this.points["0"].pos.x, this.points["0"].pos.y);
	for(var i in this.points){
		ctx.lineTo(this.points[i].pos.x,this.points[i].pos.y);
	}
	ctx.closePath();
	ctx.fillStyle="rgba("+diff+","+Math.min(diff,inv)+","+inv+",0.6)";
	ctx.fill();
}

},{}],6:[function(require,module,exports){

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

var Vec2 = require('./vec2')

exports = module.exports = VerletJS
exports.Particle = Particle
exports.Composite = Composite

function Particle(pos) {
	this.pos = (new Vec2()).mutableSet(pos);
	this.lastPos = (new Vec2()).mutableSet(pos);
}

Particle.prototype.draw = function(ctx) {
	ctx.beginPath();
	ctx.arc(this.pos.x, this.pos.y, 2, 0, 2*Math.PI);
	ctx.fillStyle = "#2dad8f";
	ctx.fill();
}

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

VerletJS.prototype.logic = function(){
	throw new Error("Logic hasn't been set")
}

VerletJS.prototype.frame = function(step) {
	var i, j, c;

	for (c in this.composites) {
		for (i in this.composites[c].particles) {
			var particles = this.composites[c].particles;

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

},{"./vec2":6}],5:[function(require,module,exports){

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
			composite.constraints.push(new DistanceConstraint(composite.particles[i], composite.particles[i-1], stiffness));
	}
	if(circle)
		composite.constraints.push(new DistanceConstraint(composite.particles[composite.particles.length-1], composite.particles[0], stiffness));


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

			if (x > 0)
				composite.constraints.push(new DistanceConstraint(composite.particles[y*segments+x], composite.particles[y*segments+x-1], stiffness));

			if (y > 0)
				composite.constraints.push(new DistanceConstraint(composite.particles[y*segments+x], composite.particles[(y-1)*segments+x], stiffness));
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
		composite.constraints.push(new DistanceConstraint(composite.particles[i], composite.particles[(i+1)%segments], treadStiffness));
		composite.constraints.push(new DistanceConstraint(composite.particles[i], center, spokeStiffness))
		composite.constraints.push(new DistanceConstraint(composite.particles[i], composite.particles[(i+5)%segments], treadStiffness));
	}

	this.composites.push(composite);
	return composite;
}

},{"./constraint":4,"./verlet":3}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NhbS9Qcm9ncmFtbWluZy9odG1sNV9hcHBzL3ZlcmxldF9waHlzaWNzX2NvbGxpc2lvbi92ZXJsZXQtanMvbGliL2Rpc3QuanMiLCIvaG9tZS9zYW0vUHJvZ3JhbW1pbmcvaHRtbDVfYXBwcy92ZXJsZXRfcGh5c2ljc19jb2xsaXNpb24vdmVybGV0LWpzL2xpYi9jb25zdHJhaW50LmpzIiwiL2hvbWUvc2FtL1Byb2dyYW1taW5nL2h0bWw1X2FwcHMvdmVybGV0X3BoeXNpY3NfY29sbGlzaW9uL3ZlcmxldC1qcy9saWIvdmVjMi5qcyIsIi9ob21lL3NhbS9Qcm9ncmFtbWluZy9odG1sNV9hcHBzL3ZlcmxldF9waHlzaWNzX2NvbGxpc2lvbi92ZXJsZXQtanMvbGliL3ZlcmxldC1kcmF3LmpzIiwiL2hvbWUvc2FtL1Byb2dyYW1taW5nL2h0bWw1X2FwcHMvdmVybGV0X3BoeXNpY3NfY29sbGlzaW9uL3ZlcmxldC1qcy9saWIvdmVybGV0LmpzIiwiL2hvbWUvc2FtL1Byb2dyYW1taW5nL2h0bWw1X2FwcHMvdmVybGV0X3BoeXNpY3NfY29sbGlzaW9uL3ZlcmxldC1qcy9saWIvb2JqZWN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiXG4vL3RoaXMgZXhwb3J0cyBhbGwgdGhlIHZlcmxldCBtZXRob2RzIGdsb2JhbGx5LCBzbyB0aGF0IHRoZSBkZW1vcyB3b3JrLlxuXG52YXIgVmVybGV0RHJhdyA9IHJlcXVpcmUoJy4vdmVybGV0LWRyYXcnKVxudmFyIFZlcmxldEpTID0gcmVxdWlyZSgnLi92ZXJsZXQnKVxudmFyIGNvbnN0cmFpbnQgPSByZXF1aXJlKCcuL2NvbnN0cmFpbnQnKVxuXHRcdFx0XHRcdFx0XHRcdCByZXF1aXJlKCcuL29iamVjdHMnKSAvL3BhdGNoZXMgVmVybGV0SlMucHJvdG90eXBlIChiYWQpXG53aW5kb3cuVmVjMiA9IHJlcXVpcmUoJy4vdmVjMicpXG53aW5kb3cuVmVybGV0SlMgPSBWZXJsZXRKU1xud2luZG93LlZlcmxldERyYXcgPSBWZXJsZXREcmF3O1xuXG53aW5kb3cuUGFydGljbGUgPSBWZXJsZXRKUy5QYXJ0aWNsZVxuXG53aW5kb3cuRGlzdGFuY2VDb25zdHJhaW50ID0gY29uc3RyYWludC5EaXN0YW5jZUNvbnN0cmFpbnRcbndpbmRvdy5QaW5Db25zdHJhaW50ICAgICAgPSBjb25zdHJhaW50LlBpbkNvbnN0cmFpbnRcbndpbmRvdy5BbmdsZUNvbnN0cmFpbnQgICAgPSBjb25zdHJhaW50LkFuZ2xlQ29uc3RyYWludFxud2luZG93LkFyZWFDb25zdHJhaW50ICAgID0gY29uc3RyYWludC5BcmVhQ29uc3RyYWludFxuIiwiXG4vKlxuQ29weXJpZ2h0IDIwMTMgU3ViIFByb3RvY29sIGFuZCBvdGhlciBjb250cmlidXRvcnNcbmh0dHA6Ly9zdWJwcm90b2NvbC5jb20vXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZ1xuYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG5cIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbndpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbmRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xucGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvXG50aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXG5pbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbkVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcbk5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcbkxJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT05cbk9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTlxuV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4qL1xuXG4vLyBEaXN0YW5jZUNvbnN0cmFpbnQgLS0gY29uc3RyYWlucyB0byBpbml0aWFsIGRpc3RhbmNlXG4vLyBQaW5Db25zdHJhaW50IC0tIGNvbnN0cmFpbnMgdG8gc3RhdGljL2ZpeGVkIHBvaW50XG4vLyBBbmdsZUNvbnN0cmFpbnQgLS0gY29uc3RyYWlucyAzIHBhcnRpY2xlcyB0byBhbiBhbmdsZVxuXG5leHBvcnRzLkRpc3RhbmNlQ29uc3RyYWludCA9IERpc3RhbmNlQ29uc3RyYWludFxuZXhwb3J0cy5QaW5Db25zdHJhaW50ID0gUGluQ29uc3RyYWludFxuZXhwb3J0cy5BbmdsZUNvbnN0cmFpbnQgPSBBbmdsZUNvbnN0cmFpbnRcbmV4cG9ydHMuQXJlYUNvbnN0cmFpbnQgPSBBcmVhQ29uc3RyYWludFxuXG5mdW5jdGlvbiBEaXN0YW5jZUNvbnN0cmFpbnQoYSwgYiwgc3RpZmZuZXNzLCBkaXN0YW5jZSAvKm9wdGlvbmFsKi8pIHtcblx0dGhpcy5hID0gYTtcblx0dGhpcy5iID0gYjtcblx0dGhpcy5kaXN0YW5jZSA9IHR5cGVvZiBkaXN0YW5jZSAhPSBcInVuZGVmaW5lZFwiID8gZGlzdGFuY2UgOiBhLnBvcy5zdWIoYi5wb3MpLmxlbmd0aCgpO1xuXHR0aGlzLnN0aWZmbmVzcyA9IHN0aWZmbmVzcztcbn1cblxuRGlzdGFuY2VDb25zdHJhaW50LnByb3RvdHlwZS5yZWxheCA9IGZ1bmN0aW9uKHN0ZXBDb2VmKSB7XG5cdHZhciBub3JtYWwgPSB0aGlzLmEucG9zLnN1Yih0aGlzLmIucG9zKTtcblx0dmFyIG0gPSBub3JtYWwubGVuZ3RoMigpO1xuXHRub3JtYWwubXV0YWJsZVNjYWxlKCgodGhpcy5kaXN0YW5jZSp0aGlzLmRpc3RhbmNlIC0gbSkvbSkqdGhpcy5zdGlmZm5lc3Mqc3RlcENvZWYpO1xuXHR0aGlzLmEucG9zLm11dGFibGVBZGQobm9ybWFsKTtcblx0dGhpcy5iLnBvcy5tdXRhYmxlU3ViKG5vcm1hbCk7XG59XG5cbkRpc3RhbmNlQ29uc3RyYWludC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGN0eCkge1xuXHRjdHguYmVnaW5QYXRoKCk7XG5cdGN0eC5tb3ZlVG8odGhpcy5hLnBvcy54LCB0aGlzLmEucG9zLnkpO1xuXHRjdHgubGluZVRvKHRoaXMuYi5wb3MueCwgdGhpcy5iLnBvcy55KTtcblx0Y3R4LnN0cm9rZVN0eWxlID0gXCIjZDhkZGUyXCI7XG5cdGN0eC5zdHJva2UoKTtcbn1cblxuXG5cbmZ1bmN0aW9uIFBpbkNvbnN0cmFpbnQoYSwgcG9zKSB7XG5cdHRoaXMuYSA9IGE7XG5cdHRoaXMucG9zID0gKG5ldyBWZWMyKCkpLm11dGFibGVTZXQocG9zKTtcbn1cblxuUGluQ29uc3RyYWludC5wcm90b3R5cGUucmVsYXggPSBmdW5jdGlvbihzdGVwQ29lZikge1xuXHR0aGlzLmEucG9zLm11dGFibGVTZXQodGhpcy5wb3MpO1xufVxuXG5QaW5Db25zdHJhaW50LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG5cdGN0eC5iZWdpblBhdGgoKTtcblx0Y3R4LmFyYyh0aGlzLnBvcy54LCB0aGlzLnBvcy55LCA2LCAwLCAyKk1hdGguUEkpO1xuXHRjdHguZmlsbFN0eWxlID0gXCJyZ2JhKDAsMTUzLDI1NSwwLjEpXCI7XG5cdGN0eC5maWxsKCk7XG59XG5cblxuZnVuY3Rpb24gQW5nbGVDb25zdHJhaW50KGEsIGIsIGMsIHN0aWZmbmVzcykge1xuXHR0aGlzLmEgPSBhO1xuXHR0aGlzLmIgPSBiO1xuXHR0aGlzLmMgPSBjO1xuXHR0aGlzLmFuZ2xlID0gdGhpcy5iLnBvcy5hbmdsZTIodGhpcy5hLnBvcywgdGhpcy5jLnBvcyk7XG5cdHRoaXMuc3RpZmZuZXNzID0gc3RpZmZuZXNzO1xufVxuXG5BbmdsZUNvbnN0cmFpbnQucHJvdG90eXBlLnJlbGF4ID0gZnVuY3Rpb24oc3RlcENvZWYpIHtcblx0dmFyIGFuZ2xlID0gdGhpcy5iLnBvcy5hbmdsZTIodGhpcy5hLnBvcywgdGhpcy5jLnBvcyk7XG5cdHZhciBkaWZmID0gYW5nbGUgLSB0aGlzLmFuZ2xlO1xuXG5cdGlmIChkaWZmIDw9IC1NYXRoLlBJKVxuXHRcdGRpZmYgKz0gMipNYXRoLlBJO1xuXHRlbHNlIGlmIChkaWZmID49IE1hdGguUEkpXG5cdFx0ZGlmZiAtPSAyKk1hdGguUEk7XG5cblx0ZGlmZiAqPSBzdGVwQ29lZip0aGlzLnN0aWZmbmVzcztcblxuXHR0aGlzLmEucG9zID0gdGhpcy5hLnBvcy5yb3RhdGUodGhpcy5iLnBvcywgZGlmZik7XG5cdHRoaXMuYy5wb3MgPSB0aGlzLmMucG9zLnJvdGF0ZSh0aGlzLmIucG9zLCAtZGlmZik7XG5cdHRoaXMuYi5wb3MgPSB0aGlzLmIucG9zLnJvdGF0ZSh0aGlzLmEucG9zLCBkaWZmKTtcblx0dGhpcy5iLnBvcyA9IHRoaXMuYi5wb3Mucm90YXRlKHRoaXMuYy5wb3MsIC1kaWZmKTtcbn1cblxuQW5nbGVDb25zdHJhaW50LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG5cdGN0eC5iZWdpblBhdGgoKTtcblx0Y3R4Lm1vdmVUbyh0aGlzLmEucG9zLngsIHRoaXMuYS5wb3MueSk7XG5cdGN0eC5saW5lVG8odGhpcy5iLnBvcy54LCB0aGlzLmIucG9zLnkpO1xuXHRjdHgubGluZVRvKHRoaXMuYy5wb3MueCwgdGhpcy5jLnBvcy55KTtcblx0dmFyIHRtcCA9IGN0eC5saW5lV2lkdGg7XG5cdGN0eC5saW5lV2lkdGggPSA1O1xuXHRjdHguc3Ryb2tlU3R5bGUgPSBcInJnYmEoMjU1LDI1NSwwLDAuMilcIjtcblx0Y3R4LnN0cm9rZSgpO1xuXHRjdHgubGluZVdpZHRoID0gdG1wO1xufVxuXG5mdW5jdGlvbiBBcmVhQ29uc3RyYWludChwb2ludHMsIHN0aWZmbmVzcykge1xuXHRpZihBcnJheS5pc0FycmF5KHBvaW50cykpe1xuXHRcdC8vbm90aGluZ1xuXHR9ZWxzZXtcblx0XHRwb2ludHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMCk7XG5cdFx0c3RpZmZuZXNzID0gcG9pbnRzLnBvcCgpO1xuXHR9XG5cdGlmKHBvaW50cy5sZW5ndGggPCAzKXtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJuZWVkIGF0IGxlYXN0IHRocmVlIHBvaW50cyBpbiBhcmdzIG9yIGFzIGFuIGFycmF5IHRvIHJldGFpbiBhbiBhcmVhXCIpO1xuXHR9XG5cdHRoaXMucG9pbnRzID0gcG9pbnRzO1xuXHR0aGlzLmFyZWEgPSBBcmVhQ29uc3RyYWludC5jYWxjdWxhdGVBcmVhX01pZCh0aGlzLnBvaW50cykuYXJlYTtcblx0aWYodGhpcy5hcmVhID09IDApe1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNhbm5vdCBjYWxjdWxhdGUgYSBub25leGlzdGFudCBhcmVhXCIpO1xuXHR9XG5cdHRoaXMuc3RpZmZuZXNzID0gc3RpZmZuZXNzO1xufVxuXG5BcmVhQ29uc3RyYWludC5jYWxjdWxhdGVBcmVhX01pZCA9IGZ1bmN0aW9uKHBvaW50cyl7XG5cdHZhciBuZXQgPSAwO1xuXHR2YXIgbWlkID0gbmV3IFZlYzIoKTtcblx0dmFyIGwgPSBwb2ludHMubGVuZ3RoO1xuXHRmb3IodmFyIGk9MDtpPGw7aSsrKXtcblx0XHRuZXQgKz0gcG9pbnRzW2ldLnBvcy54ICogcG9pbnRzWyhpKzEpJWxdLnBvcy55IC0gcG9pbnRzW2ldLnBvcy55ICogcG9pbnRzWyhpKzEpJWxdLnBvcy54O1xuXHRcdG1pZCA9IG1pZC5hZGQocG9pbnRzW2ldLnBvcy5zY2FsZSgxL2wpKTtcblx0fVxuXHRpZihuZXQgPCAwKSB0aHJvdyBuZXcgRXJyb3IoXCJuZWdhdGl2ZSBhcmVhXCIpO1xuXHRyZXR1cm4ge2FyZWE6bmV0LG1pZDptaWR9O1xufVxuXG5BcmVhQ29uc3RyYWludC5wcm90b3R5cGUucmVsYXggPSBmdW5jdGlvbihzdGVwQ29lZikge1xuXHR2YXIgYW0gPSBBcmVhQ29uc3RyYWludC5jYWxjdWxhdGVBcmVhX01pZCh0aGlzLnBvaW50cyk7XG5cdHZhciBkaWZmID0gKHRoaXMuYXJlYSoodGhpcy5zdGlmZm5lc3Mqc3RlcENvZWYpICsgKDEtdGhpcy5zdGlmZm5lc3Mqc3RlcENvZWYpKmFtLmFyZWEpL2FtLmFyZWE7XG5cblx0Ly9JIGhhdmUgdGhlIHR3byBhcmVhc1xuXHQvL0kgd2FudCB0byBoYXZlIGFsbCBwb2ludHMgdG8gZWl0aGVyIHB1c2ggYXdheSBmcm9tIHRoZSBtaWQgb3IgdG93YXJkcyB0aGUgbWlkXG5cdC8vVGhlIGV4dHJlbWl0eSBpcyBkZXBlbmRlbnQgb24gdGhlIGRpc3RhbmNlXG5cdC8vR2V0IHRoZSBkaXN0YW5jZSBiZXR3ZWVuIG1pZCBhbmQgcG9pbnRcblx0Ly9tYWtlIHRoZSBkaXN0YW5jZSB0aGUgYXBwcm9wcmlhdGUgcHJvcG9ydGlvblxuXG5cblx0Ly9maW5kaW5nIGhhbGYgdGhlIGFyZWEgb2YgYSBjaXJjbGVcblx0Ly8gQSA9IHBpICogcl4yXG5cdC8vIEEvMiA9IHBpLzIgKiByXjJcblx0Ly8gZEEgPSBwaS9kICogcl4yXG5cdC8vIHdlIGtub3cgY3VycmVudCBhcmVhXG5cdC8vIHdlIGtub3cgZGVzaXJlZCBhcmVhXG5cdC8vIChkQS9jQSkgKiBjQSA9IChkQS9jQSkgKiBwaSAqIHJeMlxuXHQvLyB3ZSdyZSBsb29raW5nIGZvciB0aGUgY2hhbmdlIGluIHIgdGhhdCBjb3JyZXNwb25kcyB0byBjaGFuZ2UgaW4gQVxuXHQvLyBzcXJ0KEEvcGkpID0gclxuXG5cblx0Ly8gd2UgZmluZCB0aGUgcG9ycG9ydGlvbiBiZXR3ZWVuIGN1ciBhbmQgZGVzaXJlZFxuXHQvLyBtdWx0aXBseSBjdXJyZW50IGRpc3RhbmNlIGJ5IHRoYXQgcG9ycG9ydGlvblxuXG4vL1x0ZGlmZiA9IDEvTWF0aC5zcXJ0KGRpZmYpO1xuLy9cdGRpZmYgKj0gc3RlcENvZWYqdGhpcy5zdGlmZm5lc3M7XG5cblx0Zm9yKHZhciBpIGluIHRoaXMucG9pbnRzKXtcblx0XHR2YXIgZGlzdCA9IHRoaXMucG9pbnRzW2ldLnBvcy5zdWIoYW0ubWlkKTtcblx0XHRkaXN0ID0gZGlzdC5zY2FsZShNYXRoLnNxcnQoZGlmZikpO1xuXHRcdGRpc3QgPSBhbS5taWQuYWRkKGRpc3QpO1xuXHRcdHRoaXMucG9pbnRzW2ldLnBvcyA9IGRpc3Q7XG5cdH1cbn1cblxuQXJlYUNvbnN0cmFpbnQucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihjdHgpIHtcblx0dmFyIGFtID0gQXJlYUNvbnN0cmFpbnQuY2FsY3VsYXRlQXJlYV9NaWQodGhpcy5wb2ludHMpO1xuXHR2YXIgZGlmZiA9IE1hdGguZmxvb3IoTWF0aC5taW4oMjU1LDI1NSp0aGlzLmFyZWEvYW0uYXJlYSkpO1xuXHR2YXIgaW52ID0gTWF0aC5mbG9vcihNYXRoLm1pbigyNTUsMjU1KmFtLmFyZWEvdGhpcy5hcmVhKSk7XG5cdGN0eC5iZWdpblBhdGgoKTtcblx0Y3R4Lm1vdmVUbyh0aGlzLnBvaW50c1tcIjBcIl0ucG9zLngsIHRoaXMucG9pbnRzW1wiMFwiXS5wb3MueSk7XG5cdGZvcih2YXIgaSBpbiB0aGlzLnBvaW50cyl7XG5cdFx0Y3R4LmxpbmVUbyh0aGlzLnBvaW50c1tpXS5wb3MueCx0aGlzLnBvaW50c1tpXS5wb3MueSk7XG5cdH1cblx0Y3R4LmNsb3NlUGF0aCgpO1xuXHRjdHguZmlsbFN0eWxlPVwicmdiYShcIitkaWZmK1wiLFwiK01hdGgubWluKGRpZmYsaW52KStcIixcIitpbnYrXCIsMC42KVwiO1xuXHRjdHguZmlsbCgpO1xufVxuIiwiXG4vKlxuQ29weXJpZ2h0IDIwMTMgU3ViIFByb3RvY29sIGFuZCBvdGhlciBjb250cmlidXRvcnNcbmh0dHA6Ly9zdWJwcm90b2NvbC5jb20vXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZ1xuYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG5cIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbndpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbmRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xucGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvXG50aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXG5pbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbkVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcbk5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcbkxJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT05cbk9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTlxuV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4qL1xuXG4vLyBBIHNpbXBsZSAyLWRpbWVuc2lvbmFsIHZlY3RvciBpbXBsZW1lbnRhdGlvblxuXG5tb2R1bGUuZXhwb3J0cyA9IFZlYzJcblxuZnVuY3Rpb24gVmVjMih4LCB5KSB7XG5cdHRoaXMueCA9IHggfHwgMDtcblx0dGhpcy55ID0geSB8fCAwO1xufVxuXG5WZWMyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbih2KSB7XG5cdHJldHVybiBuZXcgVmVjMih0aGlzLnggKyB2LngsIHRoaXMueSArIHYueSk7XG59XG5cblZlYzIucHJvdG90eXBlLnN1YiA9IGZ1bmN0aW9uKHYpIHtcblx0cmV0dXJuIG5ldyBWZWMyKHRoaXMueCAtIHYueCwgdGhpcy55IC0gdi55KTtcbn1cblxuVmVjMi5wcm90b3R5cGUubXVsID0gZnVuY3Rpb24odikge1xuXHRyZXR1cm4gbmV3IFZlYzIodGhpcy54ICogdi54LCB0aGlzLnkgKiB2LnkpO1xufVxuXG5WZWMyLnByb3RvdHlwZS5kaXYgPSBmdW5jdGlvbih2KSB7XG5cdHJldHVybiBuZXcgVmVjMih0aGlzLnggLyB2LngsIHRoaXMueSAvIHYueSk7XG59XG5cblZlYzIucHJvdG90eXBlLnNjYWxlID0gZnVuY3Rpb24oY29lZikge1xuXHRyZXR1cm4gbmV3IFZlYzIodGhpcy54KmNvZWYsIHRoaXMueSpjb2VmKTtcbn1cblxuVmVjMi5wcm90b3R5cGUubXV0YWJsZVNldCA9IGZ1bmN0aW9uKHYpIHtcblx0dGhpcy54ID0gdi54O1xuXHR0aGlzLnkgPSB2Lnk7XG5cdHJldHVybiB0aGlzO1xufVxuXG5WZWMyLnByb3RvdHlwZS5tdXRhYmxlQWRkID0gZnVuY3Rpb24odikge1xuXHR0aGlzLnggKz0gdi54O1xuXHR0aGlzLnkgKz0gdi55O1xuXHRyZXR1cm4gdGhpcztcbn1cblxuVmVjMi5wcm90b3R5cGUubXV0YWJsZVN1YiA9IGZ1bmN0aW9uKHYpIHtcblx0dGhpcy54IC09IHYueDtcblx0dGhpcy55IC09IHYueTtcblx0cmV0dXJuIHRoaXM7XG59XG5cblZlYzIucHJvdG90eXBlLm11dGFibGVNdWwgPSBmdW5jdGlvbih2KSB7XG5cdHRoaXMueCAqPSB2Lng7XG5cdHRoaXMueSAqPSB2Lnk7XG5cdHJldHVybiB0aGlzO1xufVxuXG5WZWMyLnByb3RvdHlwZS5tdXRhYmxlRGl2ID0gZnVuY3Rpb24odikge1xuXHR0aGlzLnggLz0gdi54O1xuXHR0aGlzLnkgLz0gdi55O1xuXHRyZXR1cm4gdGhpcztcbn1cblxuVmVjMi5wcm90b3R5cGUubXV0YWJsZVNjYWxlID0gZnVuY3Rpb24oY29lZikge1xuXHR0aGlzLnggKj0gY29lZjtcblx0dGhpcy55ICo9IGNvZWY7XG5cdHJldHVybiB0aGlzO1xufVxuXG5WZWMyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbih2KSB7XG5cdHJldHVybiB0aGlzLnggPT0gdi54ICYmIHRoaXMueSA9PSB2Lnk7XG59XG5cblZlYzIucHJvdG90eXBlLmVwc2lsb25FcXVhbHMgPSBmdW5jdGlvbih2LCBlcHNpbG9uKSB7XG5cdHJldHVybiBNYXRoLmFicyh0aGlzLnggLSB2LngpIDw9IGVwc2lsb24gJiYgTWF0aC5hYnModGhpcy55IC0gdi55KSA8PSBlcHNpbG9uO1xufVxuXG5WZWMyLnByb3RvdHlwZS5sZW5ndGggPSBmdW5jdGlvbih2KSB7XG5cdHJldHVybiBNYXRoLnNxcnQodGhpcy54KnRoaXMueCArIHRoaXMueSp0aGlzLnkpO1xufVxuXG5WZWMyLnByb3RvdHlwZS5sZW5ndGgyID0gZnVuY3Rpb24odikge1xuXHRyZXR1cm4gdGhpcy54KnRoaXMueCArIHRoaXMueSp0aGlzLnk7XG59XG5cblZlYzIucHJvdG90eXBlLmRpc3QgPSBmdW5jdGlvbih2KSB7XG5cdHJldHVybiBNYXRoLnNxcnQodGhpcy5kaXN0Mih2KSk7XG59XG5cblZlYzIucHJvdG90eXBlLmRpc3QyID0gZnVuY3Rpb24odikge1xuXHR2YXIgeCA9IHYueCAtIHRoaXMueDtcblx0dmFyIHkgPSB2LnkgLSB0aGlzLnk7XG5cdHJldHVybiB4KnggKyB5Knk7XG59XG5cblZlYzIucHJvdG90eXBlLm5vcm1hbCA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgbSA9IE1hdGguc3FydCh0aGlzLngqdGhpcy54ICsgdGhpcy55KnRoaXMueSk7XG5cdHJldHVybiBuZXcgVmVjMih0aGlzLngvbSwgdGhpcy55L20pO1xufVxuXG5WZWMyLnByb3RvdHlwZS5kb3QgPSBmdW5jdGlvbih2KSB7XG5cdHJldHVybiB0aGlzLngqdi54ICsgdGhpcy55KnYueTtcbn1cblxuVmVjMi5wcm90b3R5cGUuYW5nbGUgPSBmdW5jdGlvbih2KSB7XG5cdHJldHVybiBNYXRoLmF0YW4yKHRoaXMueCp2LnktdGhpcy55KnYueCx0aGlzLngqdi54K3RoaXMueSp2LnkpO1xufVxuXG5WZWMyLnByb3RvdHlwZS5hbmdsZTIgPSBmdW5jdGlvbih2TGVmdCwgdlJpZ2h0KSB7XG5cdHJldHVybiB2TGVmdC5zdWIodGhpcykuYW5nbGUodlJpZ2h0LnN1Yih0aGlzKSk7XG59XG5cblZlYzIucHJvdG90eXBlLnJvdGF0ZSA9IGZ1bmN0aW9uKG9yaWdpbiwgdGhldGEpIHtcblx0dmFyIHggPSB0aGlzLnggLSBvcmlnaW4ueDtcblx0dmFyIHkgPSB0aGlzLnkgLSBvcmlnaW4ueTtcblx0cmV0dXJuIG5ldyBWZWMyKHgqTWF0aC5jb3ModGhldGEpIC0geSpNYXRoLnNpbih0aGV0YSkgKyBvcmlnaW4ueCwgeCpNYXRoLnNpbih0aGV0YSkgKyB5Kk1hdGguY29zKHRoZXRhKSArIG9yaWdpbi55KTtcbn1cblxuVmVjMi5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIFwiKFwiICsgdGhpcy54ICsgXCIsIFwiICsgdGhpcy55ICsgXCIpXCI7XG59XG5cbmZ1bmN0aW9uIHRlc3RfVmVjMigpIHtcblx0dmFyIGFzc2VydCA9IGZ1bmN0aW9uKGxhYmVsLCBleHByZXNzaW9uKSB7XG5cdFx0Y29uc29sZS5sb2coXCJWZWMyKFwiICsgbGFiZWwgKyBcIik6IFwiICsgKGV4cHJlc3Npb24gPT0gdHJ1ZSA/IFwiUEFTU1wiIDogXCJGQUlMXCIpKTtcblx0XHRpZiAoZXhwcmVzc2lvbiAhPSB0cnVlKVxuXHRcdFx0dGhyb3cgXCJhc3NlcnRpb24gZmFpbGVkXCI7XG5cdH07XG5cblx0YXNzZXJ0KFwiZXF1YWxpdHlcIiwgKG5ldyBWZWMyKDUsMykuZXF1YWxzKG5ldyBWZWMyKDUsMykpKSk7XG5cdGFzc2VydChcImVwc2lsb24gZXF1YWxpdHlcIiwgKG5ldyBWZWMyKDEsMikuZXBzaWxvbkVxdWFscyhuZXcgVmVjMigxLjAxLDIuMDIpLCAwLjAzKSkpO1xuXHRhc3NlcnQoXCJlcHNpbG9uIG5vbi1lcXVhbGl0eVwiLCAhKG5ldyBWZWMyKDEsMikuZXBzaWxvbkVxdWFscyhuZXcgVmVjMigxLjAxLDIuMDIpLCAwLjAxKSkpO1xuXHRhc3NlcnQoXCJhZGRpdGlvblwiLCAobmV3IFZlYzIoMSwxKSkuYWRkKG5ldyBWZWMyKDIsIDMpKS5lcXVhbHMobmV3IFZlYzIoMywgNCkpKTtcblx0YXNzZXJ0KFwic3VidHJhY3Rpb25cIiwgKG5ldyBWZWMyKDQsMykpLnN1YihuZXcgVmVjMigyLCAxKSkuZXF1YWxzKG5ldyBWZWMyKDIsIDIpKSk7XG5cdGFzc2VydChcIm11bHRpcGx5XCIsIChuZXcgVmVjMigyLDQpKS5tdWwobmV3IFZlYzIoMiwgMSkpLmVxdWFscyhuZXcgVmVjMig0LCA0KSkpO1xuXHRhc3NlcnQoXCJkaXZpZGVcIiwgKG5ldyBWZWMyKDQsMikpLmRpdihuZXcgVmVjMigyLCAyKSkuZXF1YWxzKG5ldyBWZWMyKDIsIDEpKSk7XG5cdGFzc2VydChcInNjYWxlXCIsIChuZXcgVmVjMig0LDMpKS5zY2FsZSgyKS5lcXVhbHMobmV3IFZlYzIoOCwgNikpKTtcblx0YXNzZXJ0KFwibXV0YWJsZSBzZXRcIiwgKG5ldyBWZWMyKDEsMSkpLm11dGFibGVTZXQobmV3IFZlYzIoMiwgMykpLmVxdWFscyhuZXcgVmVjMigyLCAzKSkpO1xuXHRhc3NlcnQoXCJtdXRhYmxlIGFkZGl0aW9uXCIsIChuZXcgVmVjMigxLDEpKS5tdXRhYmxlQWRkKG5ldyBWZWMyKDIsIDMpKS5lcXVhbHMobmV3IFZlYzIoMywgNCkpKTtcblx0YXNzZXJ0KFwibXV0YWJsZSBzdWJ0cmFjdGlvblwiLCAobmV3IFZlYzIoNCwzKSkubXV0YWJsZVN1YihuZXcgVmVjMigyLCAxKSkuZXF1YWxzKG5ldyBWZWMyKDIsIDIpKSk7XG5cdGFzc2VydChcIm11dGFibGUgbXVsdGlwbHlcIiwgKG5ldyBWZWMyKDIsNCkpLm11dGFibGVNdWwobmV3IFZlYzIoMiwgMSkpLmVxdWFscyhuZXcgVmVjMig0LCA0KSkpO1xuXHRhc3NlcnQoXCJtdXRhYmxlIGRpdmlkZVwiLCAobmV3IFZlYzIoNCwyKSkubXV0YWJsZURpdihuZXcgVmVjMigyLCAyKSkuZXF1YWxzKG5ldyBWZWMyKDIsIDEpKSk7XG5cdGFzc2VydChcIm11dGFibGUgc2NhbGVcIiwgKG5ldyBWZWMyKDQsMykpLm11dGFibGVTY2FsZSgyKS5lcXVhbHMobmV3IFZlYzIoOCwgNikpKTtcblx0YXNzZXJ0KFwibGVuZ3RoXCIsIE1hdGguYWJzKChuZXcgVmVjMig0LDQpKS5sZW5ndGgoKSAtIDUuNjU2ODUpIDw9IDAuMDAwMDEpO1xuXHRhc3NlcnQoXCJsZW5ndGgyXCIsIChuZXcgVmVjMigyLDQpKS5sZW5ndGgyKCkgPT0gMjApO1xuXHRhc3NlcnQoXCJkaXN0XCIsIE1hdGguYWJzKChuZXcgVmVjMigyLDQpKS5kaXN0KG5ldyBWZWMyKDMsNSkpIC0gMS40MTQyMTM1KSA8PSAwLjAwMDAwMSk7XG5cdGFzc2VydChcImRpc3QyXCIsIChuZXcgVmVjMigyLDQpKS5kaXN0MihuZXcgVmVjMigzLDUpKSA9PSAyKTtcblxuXHR2YXIgbm9ybWFsID0gKG5ldyBWZWMyKDIsNCkpLm5vcm1hbCgpXG5cdGFzc2VydChcIm5vcm1hbFwiLCBNYXRoLmFicyhub3JtYWwubGVuZ3RoKCkgLSAxLjApIDw9IDAuMDAwMDEgJiYgbm9ybWFsLmVwc2lsb25FcXVhbHMobmV3IFZlYzIoMC40NDcyLCAwLjg5NDQzKSwgMC4wMDAxKSk7XG5cdGFzc2VydChcImRvdFwiLCAobmV3IFZlYzIoMiwzKSkuZG90KG5ldyBWZWMyKDQsMSkpID09IDExKTtcblx0YXNzZXJ0KFwiYW5nbGVcIiwgKG5ldyBWZWMyKDAsLTEpKS5hbmdsZShuZXcgVmVjMigxLDApKSooMTgwL01hdGguUEkpID09IDkwKTtcblx0YXNzZXJ0KFwiYW5nbGUyXCIsIChuZXcgVmVjMigxLDEpKS5hbmdsZTIobmV3IFZlYzIoMSwwKSwgbmV3IFZlYzIoMiwxKSkqKDE4MC9NYXRoLlBJKSA9PSA5MCk7XG5cdGFzc2VydChcInJvdGF0ZVwiLCAobmV3IFZlYzIoMiwwKSkucm90YXRlKG5ldyBWZWMyKDEsMCksIE1hdGguUEkvMikuZXF1YWxzKG5ldyBWZWMyKDEsMSkpKTtcblx0YXNzZXJ0KFwidG9TdHJpbmdcIiwgKG5ldyBWZWMyKDIsNCkpID09IFwiKDIsIDQpXCIpO1xufVxuIiwiXG53aW5kb3cucmVxdWVzdEFuaW1GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbnx8IHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbnx8IHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbnx8IHdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lXG58fCB3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbnx8IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gIHdpbmRvdy5zZXRUaW1lb3V0KGNhbGxiYWNrLCAxMDAwIC8gNjApO1xufTtcbnZhciBWZXJsZXRKUyA9IHJlcXVpcmUoXCIuL3ZlcmxldC5qc1wiKTtcbm1vZHVsZS5leHBvcnRzID0gVmVybGV0RHJhdztcblxuZnVuY3Rpb24gVmVybGV0RHJhdyh3aWR0aCwgaGVpZ2h0LCBjYW52YXMsIHBoeXNpY3MpIHtcbiAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG4gIHRoaXMuY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgdGhpcy5tb3VzZSA9IG5ldyBWZWMyKDAsMCk7XG4gIHRoaXMubW91c2VEb3duID0gZmFsc2U7XG4gIHRoaXMuZHJhZ2dlZEVudGl0eSA9IG51bGw7XG4gIHRoaXMuc2VsZWN0aW9uUmFkaXVzID0gMjA7XG4gIHRoaXMuaGlnaGxpZ2h0Q29sb3IgPSBcIiM0ZjU0NWNcIjtcbiAgdGhpcy5waHlzaWNzID0gKCFwaHlzaWNzKT9uZXcgVmVybGV0SlMod2lkdGgsaGVpZ2h0KTpwaHlzaWNzO1xuXG4gIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgdGhpcy5waHlzaWNzLmxvZ2ljID0gZnVuY3Rpb24oKXtcbiAgICAvLyBoYW5kbGUgZHJhZ2dpbmcgb2YgZW50aXRpZXNcbiAgICBpZiAoX3RoaXMuZHJhZ2dlZEVudGl0eSlcbiAgICAgIF90aGlzLmRyYWdnZWRFbnRpdHkucG9zLm11dGFibGVTZXQoX3RoaXMubW91c2UpO1xuICB9XG5cblxuICAvLyBwcmV2ZW50IGNvbnRleHQgbWVudVxuICB0aGlzLmNhbnZhcy5vbmNvbnRleHRtZW51ID0gZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfTtcblxuICB0aGlzLmNhbnZhcy5vbm1vdXNlZG93biA9IGZ1bmN0aW9uKGUpIHtcbiAgICBfdGhpcy5tb3VzZURvd24gPSB0cnVlO1xuICAgIHZhciBuZWFyZXN0ID0gX3RoaXMucGh5c2ljcy5uZWFyZXN0RW50aXR5KF90aGlzLm1vdXNlLF90aGlzLnNlbGVjdGlvblJhZGl1cyk7O1xuICAgIGlmIChuZWFyZXN0KSB7XG4gICAgICBfdGhpcy5kcmFnZ2VkRW50aXR5ID0gbmVhcmVzdDtcbiAgICB9XG4gIH07XG5cbiAgdGhpcy5jYW52YXMub25tb3VzZXVwID0gZnVuY3Rpb24oZSkge1xuICAgIF90aGlzLm1vdXNlRG93biA9IGZhbHNlO1xuICAgIF90aGlzLmRyYWdnZWRFbnRpdHkgPSBudWxsO1xuICB9O1xuXG4gIHRoaXMuY2FudmFzLm9ubW91c2Vtb3ZlID0gZnVuY3Rpb24oZSkge1xuICAgIHZhciByZWN0ID0gX3RoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIF90aGlzLm1vdXNlLnggPSBlLmNsaWVudFggLSByZWN0LmxlZnQ7XG4gICAgX3RoaXMubW91c2UueSA9IGUuY2xpZW50WSAtIHJlY3QudG9wO1xuICB9O1xuXG59XG5cblxuVmVybGV0RHJhdy5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaSwgYztcblxuICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG4gIHZhciBjb21wb3NpdGVzID0gdGhpcy5waHlzaWNzLmNvbXBvc2l0ZXM7XG4gIGZvciAoYyBpbiBjb21wb3NpdGVzKSB7XG4gICAgLy8gZHJhdyBjb25zdHJhaW50c1xuICAgIGlmIChjb21wb3NpdGVzW2NdLmRyYXdDb25zdHJhaW50cykge1xuICAgICAgY29tcG9zaXRlc1tjXS5kcmF3Q29uc3RyYWludHModGhpcy5jdHgsIGNvbXBvc2l0ZXNbY10pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgY29uc3RyYWludHMgPSBjb21wb3NpdGVzW2NdLmNvbnN0cmFpbnRzO1xuICAgICAgZm9yIChpIGluIGNvbnN0cmFpbnRzKVxuICAgICAgICBjb25zdHJhaW50c1tpXS5kcmF3KHRoaXMuY3R4KTtcbiAgICB9XG5cbiAgICAvLyBkcmF3IHBhcnRpY2xlc1xuICAgIGlmIChjb21wb3NpdGVzW2NdLmRyYXdQYXJ0aWNsZXMpIHtcbiAgICAgIGNvbXBvc2l0ZXNbY10uZHJhd1BhcnRpY2xlcyh0aGlzLmN0eCwgY29tcG9zaXRlc1tjXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBwYXJ0aWNsZXMgPSBjb21wb3NpdGVzW2NdLnBhcnRpY2xlcztcbiAgICAgIGZvciAoaSBpbiBwYXJ0aWNsZXMpXG4gICAgICAgIHBhcnRpY2xlc1tpXS5kcmF3KHRoaXMuY3R4KTtcbiAgICB9XG4gIH1cblxuICAvLyBoaWdobGlnaHQgbmVhcmVzdCAvIGRyYWdnZWQgZW50aXR5XG4gIHZhciBuZWFyZXN0ID0gdGhpcy5kcmFnZ2VkRW50aXR5IHx8IHRoaXMucGh5c2ljcy5uZWFyZXN0RW50aXR5KHRoaXMubW91c2UsdGhpcy5zZWxlY3Rpb25SYWRpdXMpO1xuICBpZiAobmVhcmVzdCkge1xuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgIHRoaXMuY3R4LmFyYyhuZWFyZXN0LnBvcy54LCBuZWFyZXN0LnBvcy55LCA4LCAwLCAyKk1hdGguUEkpO1xuICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5oaWdobGlnaHRDb2xvcjtcbiAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgfVxufVxuIiwiXG4vKlxuQ29weXJpZ2h0IDIwMTMgU3ViIFByb3RvY29sIGFuZCBvdGhlciBjb250cmlidXRvcnNcbmh0dHA6Ly9zdWJwcm90b2NvbC5jb20vXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZ1xuYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG5cIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbndpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbmRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xucGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvXG50aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXG5pbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbkVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcbk5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcbkxJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT05cbk9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTlxuV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4qL1xuXG52YXIgVmVjMiA9IHJlcXVpcmUoJy4vdmVjMicpXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IFZlcmxldEpTXG5leHBvcnRzLlBhcnRpY2xlID0gUGFydGljbGVcbmV4cG9ydHMuQ29tcG9zaXRlID0gQ29tcG9zaXRlXG5cbmZ1bmN0aW9uIFBhcnRpY2xlKHBvcykge1xuXHR0aGlzLnBvcyA9IChuZXcgVmVjMigpKS5tdXRhYmxlU2V0KHBvcyk7XG5cdHRoaXMubGFzdFBvcyA9IChuZXcgVmVjMigpKS5tdXRhYmxlU2V0KHBvcyk7XG59XG5cblBhcnRpY2xlLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG5cdGN0eC5iZWdpblBhdGgoKTtcblx0Y3R4LmFyYyh0aGlzLnBvcy54LCB0aGlzLnBvcy55LCAyLCAwLCAyKk1hdGguUEkpO1xuXHRjdHguZmlsbFN0eWxlID0gXCIjMmRhZDhmXCI7XG5cdGN0eC5maWxsKCk7XG59XG5cbmZ1bmN0aW9uIFZlcmxldEpTKHdpZHRoLCBoZWlnaHQpIHtcblx0dGhpcy53aWR0aCA9IHdpZHRoO1xuXHR0aGlzLmhlaWdodCA9IGhlaWdodDtcblxuXHR0aGlzLmJvdW5kcyA9IGZ1bmN0aW9uIChwYXJ0aWNsZSkge1xuXHRcdGlmIChwYXJ0aWNsZS5wb3MueSA+IHRoaXMuaGVpZ2h0LTEpXG5cdFx0XHRwYXJ0aWNsZS5wb3MueSA9IHRoaXMuaGVpZ2h0LTE7XG5cblx0XHRpZiAocGFydGljbGUucG9zLnggPCAwKVxuXHRcdFx0cGFydGljbGUucG9zLnggPSAwO1xuXG5cdFx0aWYgKHBhcnRpY2xlLnBvcy54ID4gdGhpcy53aWR0aC0xKVxuXHRcdFx0cGFydGljbGUucG9zLnggPSB0aGlzLndpZHRoLTE7XG5cdH1cblxuXHQvLyBzaW11bGF0aW9uIHBhcmFtc1xuXHR0aGlzLmdyYXZpdHkgPSBuZXcgVmVjMigwLDAuMik7XG5cdHRoaXMuZnJpY3Rpb24gPSAwLjk5O1xuXHR0aGlzLmdyb3VuZEZyaWN0aW9uID0gMC44O1xuXG5cdC8vIGhvbGRzIGNvbXBvc2l0ZSBlbnRpdGllc1xuXHR0aGlzLmNvbXBvc2l0ZXMgPSBbXTtcbn1cblxuVmVybGV0SlMucHJvdG90eXBlLkNvbXBvc2l0ZSA9IENvbXBvc2l0ZVxuXG5mdW5jdGlvbiBDb21wb3NpdGUoKSB7XG5cdHRoaXMucGFydGljbGVzID0gW107XG5cdHRoaXMuY29uc3RyYWludHMgPSBbXTtcblxuXHR0aGlzLmRyYXdQYXJ0aWNsZXMgPSBudWxsO1xuXHR0aGlzLmRyYXdDb25zdHJhaW50cyA9IG51bGw7XG59XG5cbkNvbXBvc2l0ZS5wcm90b3R5cGUucGluID0gZnVuY3Rpb24oaW5kZXgsIHBvcykge1xuXHRwb3MgPSBwb3MgfHwgdGhpcy5wYXJ0aWNsZXNbaW5kZXhdLnBvcztcblx0dmFyIHBjID0gbmV3IFBpbkNvbnN0cmFpbnQodGhpcy5wYXJ0aWNsZXNbaW5kZXhdLCBwb3MpO1xuXHR0aGlzLmNvbnN0cmFpbnRzLnB1c2gocGMpO1xuXHRyZXR1cm4gcGM7XG59XG5cblZlcmxldEpTLnByb3RvdHlwZS5sb2dpYyA9IGZ1bmN0aW9uKCl7XG5cdHRocm93IG5ldyBFcnJvcihcIkxvZ2ljIGhhc24ndCBiZWVuIHNldFwiKVxufVxuXG5WZXJsZXRKUy5wcm90b3R5cGUuZnJhbWUgPSBmdW5jdGlvbihzdGVwKSB7XG5cdHZhciBpLCBqLCBjO1xuXG5cdGZvciAoYyBpbiB0aGlzLmNvbXBvc2l0ZXMpIHtcblx0XHRmb3IgKGkgaW4gdGhpcy5jb21wb3NpdGVzW2NdLnBhcnRpY2xlcykge1xuXHRcdFx0dmFyIHBhcnRpY2xlcyA9IHRoaXMuY29tcG9zaXRlc1tjXS5wYXJ0aWNsZXM7XG5cblx0XHRcdC8vIGNhbGN1bGF0ZSB2ZWxvY2l0eVxuXHRcdFx0dmFyIHZlbG9jaXR5ID0gcGFydGljbGVzW2ldLnBvcy5zdWIocGFydGljbGVzW2ldLmxhc3RQb3MpLnNjYWxlKHRoaXMuZnJpY3Rpb24pO1xuXG5cdFx0XHQvLyBncm91bmQgZnJpY3Rpb25cblx0XHRcdGlmIChwYXJ0aWNsZXNbaV0ucG9zLnkgPj0gdGhpcy5oZWlnaHQtMSAmJiB2ZWxvY2l0eS5sZW5ndGgyKCkgPiAwLjAwMDAwMSkge1xuXHRcdFx0XHR2YXIgbSA9IHZlbG9jaXR5Lmxlbmd0aCgpO1xuXHRcdFx0XHR2ZWxvY2l0eS54IC89IG07XG5cdFx0XHRcdHZlbG9jaXR5LnkgLz0gbTtcblx0XHRcdFx0dmVsb2NpdHkubXV0YWJsZVNjYWxlKG0qdGhpcy5ncm91bmRGcmljdGlvbik7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHNhdmUgbGFzdCBnb29kIHN0YXRlXG5cdFx0XHRwYXJ0aWNsZXNbaV0ubGFzdFBvcy5tdXRhYmxlU2V0KHBhcnRpY2xlc1tpXS5wb3MpO1xuXG5cdFx0XHQvLyBncmF2aXR5XG5cdFx0XHRwYXJ0aWNsZXNbaV0ucG9zLm11dGFibGVBZGQodGhpcy5ncmF2aXR5KTtcblxuXHRcdFx0Ly8gaW5lcnRpYVxuXHRcdFx0cGFydGljbGVzW2ldLnBvcy5tdXRhYmxlQWRkKHZlbG9jaXR5KTtcblx0XHR9XG5cdH1cblxuXHR0aGlzLmxvZ2ljKCk7XG5cblx0Ly8gcmVsYXhcblx0dmFyIHN0ZXBDb2VmID0gMS9zdGVwO1xuXHRmb3IgKGMgaW4gdGhpcy5jb21wb3NpdGVzKSB7XG5cdFx0dmFyIGNvbnN0cmFpbnRzID0gdGhpcy5jb21wb3NpdGVzW2NdLmNvbnN0cmFpbnRzO1xuXHRcdGZvciAoaT0wO2k8c3RlcDsrK2kpXG5cdFx0XHRmb3IgKGogaW4gY29uc3RyYWludHMpXG5cdFx0XHRcdGNvbnN0cmFpbnRzW2pdLnJlbGF4KHN0ZXBDb2VmKTtcblx0fVxuXG5cdC8vIGJvdW5kcyBjaGVja2luZ1xuXHRmb3IgKGMgaW4gdGhpcy5jb21wb3NpdGVzKSB7XG5cdFx0dmFyIHBhcnRpY2xlcyA9IHRoaXMuY29tcG9zaXRlc1tjXS5wYXJ0aWNsZXM7XG5cdFx0Zm9yIChpIGluIHBhcnRpY2xlcylcblx0XHRcdHRoaXMuYm91bmRzKHBhcnRpY2xlc1tpXSk7XG5cdH1cbn1cblxuXG5WZXJsZXRKUy5wcm90b3R5cGUubmVhcmVzdEVudGl0eSA9IGZ1bmN0aW9uKHRhcmdldF92ZWMyLHJhZGl1cykge1xuXHR2YXIgYywgaTtcblx0dmFyIGQyTmVhcmVzdCA9IDA7XG5cdHZhciBlbnRpdHkgPSBudWxsO1xuXHR2YXIgY29uc3RyYWludHNOZWFyZXN0ID0gbnVsbDtcblxuXHQvLyBmaW5kIG5lYXJlc3QgcG9pbnRcblx0Zm9yIChjIGluIHRoaXMuY29tcG9zaXRlcykge1xuXHRcdHZhciBwYXJ0aWNsZXMgPSB0aGlzLmNvbXBvc2l0ZXNbY10ucGFydGljbGVzO1xuXHRcdGZvciAoaSBpbiBwYXJ0aWNsZXMpIHtcblx0XHRcdHZhciBkMiA9IHBhcnRpY2xlc1tpXS5wb3MuZGlzdDIodGFyZ2V0X3ZlYzIpO1xuXHRcdFx0aWYgKGQyIDw9IHJhZGl1cypyYWRpdXMgJiYgKGVudGl0eSA9PSBudWxsIHx8IGQyIDwgZDJOZWFyZXN0KSkge1xuXHRcdFx0XHRlbnRpdHkgPSBwYXJ0aWNsZXNbaV07XG5cdFx0XHRcdGNvbnN0cmFpbnRzTmVhcmVzdCA9IHRoaXMuY29tcG9zaXRlc1tjXS5jb25zdHJhaW50cztcblx0XHRcdFx0ZDJOZWFyZXN0ID0gZDI7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gc2VhcmNoIGZvciBwaW5uZWQgY29uc3RyYWludHMgZm9yIHRoaXMgZW50aXR5XG5cdGZvciAoaSBpbiBjb25zdHJhaW50c05lYXJlc3QpXG5cdFx0aWYgKGNvbnN0cmFpbnRzTmVhcmVzdFtpXSBpbnN0YW5jZW9mIFBpbkNvbnN0cmFpbnQgJiYgY29uc3RyYWludHNOZWFyZXN0W2ldLmEgPT0gZW50aXR5KVxuXHRcdFx0ZW50aXR5ID0gY29uc3RyYWludHNOZWFyZXN0W2ldO1xuXG5cdHJldHVybiBlbnRpdHk7XG59XG4iLCJcbi8qXG5Db3B5cmlnaHQgMjAxMyBTdWIgUHJvdG9jb2wgYW5kIG90aGVyIGNvbnRyaWJ1dG9yc1xuaHR0cDovL3N1YnByb3RvY29sLmNvbS9cblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nXG5hIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcblwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xud2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG5wZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG9cbnRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmVcbmluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG5NRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRVxuTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTlxuT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXG5XSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiovXG5cbi8vIGdlbmVyaWMgdmVybGV0IGVudGl0aWVzXG5cbnZhciBWZXJsZXRKUyA9IHJlcXVpcmUoJy4vdmVybGV0JylcbnZhciBQYXJ0aWNsZSA9IFZlcmxldEpTLlBhcnRpY2xlXG52YXIgY29uc3RyYWludHMgPSByZXF1aXJlKCcuL2NvbnN0cmFpbnQnKVxudmFyIERpc3RhbmNlQ29uc3RyYWludCA9IGNvbnN0cmFpbnRzLkRpc3RhbmNlQ29uc3RyYWludFxuXG5WZXJsZXRKUy5wcm90b3R5cGUucG9pbnQgPSBmdW5jdGlvbihwb3MpIHtcblx0dmFyIGNvbXBvc2l0ZSA9IG5ldyB0aGlzLkNvbXBvc2l0ZSgpO1xuXHRjb21wb3NpdGUucGFydGljbGVzLnB1c2gobmV3IFBhcnRpY2xlKHBvcykpO1xuXHR0aGlzLmNvbXBvc2l0ZXMucHVzaChjb21wb3NpdGUpO1xuXHRyZXR1cm4gY29tcG9zaXRlO1xufVxuXG5WZXJsZXRKUy5wcm90b3R5cGUubGluZVNlZ21lbnRzID0gZnVuY3Rpb24odmVydGljZXMsIHN0aWZmbmVzcywgY2lyY2xlKSB7XG5cdHZhciBpO1xuXG5cdHZhciBjb21wb3NpdGUgPSBuZXcgdGhpcy5Db21wb3NpdGUoKTtcblxuXHRmb3IgKGkgaW4gdmVydGljZXMpIHtcblx0XHRjb21wb3NpdGUucGFydGljbGVzLnB1c2gobmV3IFBhcnRpY2xlKHZlcnRpY2VzW2ldKSk7XG5cdFx0aWYgKGkgPiAwKVxuXHRcdFx0Y29tcG9zaXRlLmNvbnN0cmFpbnRzLnB1c2gobmV3IERpc3RhbmNlQ29uc3RyYWludChjb21wb3NpdGUucGFydGljbGVzW2ldLCBjb21wb3NpdGUucGFydGljbGVzW2ktMV0sIHN0aWZmbmVzcykpO1xuXHR9XG5cdGlmKGNpcmNsZSlcblx0XHRjb21wb3NpdGUuY29uc3RyYWludHMucHVzaChuZXcgRGlzdGFuY2VDb25zdHJhaW50KGNvbXBvc2l0ZS5wYXJ0aWNsZXNbY29tcG9zaXRlLnBhcnRpY2xlcy5sZW5ndGgtMV0sIGNvbXBvc2l0ZS5wYXJ0aWNsZXNbMF0sIHN0aWZmbmVzcykpO1xuXG5cblx0dGhpcy5jb21wb3NpdGVzLnB1c2goY29tcG9zaXRlKTtcblx0cmV0dXJuIGNvbXBvc2l0ZTtcbn1cblxuVmVybGV0SlMucHJvdG90eXBlLmNsb3RoID0gZnVuY3Rpb24ob3JpZ2luLCB3aWR0aCwgaGVpZ2h0LCBzZWdtZW50cywgcGluTW9kLCBzdGlmZm5lc3MpIHtcblxuXHR2YXIgY29tcG9zaXRlID0gbmV3IHRoaXMuQ29tcG9zaXRlKCk7XG5cblx0dmFyIHhTdHJpZGUgPSB3aWR0aC9zZWdtZW50cztcblx0dmFyIHlTdHJpZGUgPSBoZWlnaHQvc2VnbWVudHM7XG5cblx0dmFyIHgseTtcblx0Zm9yICh5PTA7eTxzZWdtZW50czsrK3kpIHtcblx0XHRmb3IgKHg9MDt4PHNlZ21lbnRzOysreCkge1xuXHRcdFx0dmFyIHB4ID0gb3JpZ2luLnggKyB4KnhTdHJpZGUgLSB3aWR0aC8yICsgeFN0cmlkZS8yO1xuXHRcdFx0dmFyIHB5ID0gb3JpZ2luLnkgKyB5KnlTdHJpZGUgLSBoZWlnaHQvMiArIHlTdHJpZGUvMjtcblx0XHRcdGNvbXBvc2l0ZS5wYXJ0aWNsZXMucHVzaChuZXcgUGFydGljbGUobmV3IFZlYzIocHgsIHB5KSkpO1xuXG5cdFx0XHRpZiAoeCA+IDApXG5cdFx0XHRcdGNvbXBvc2l0ZS5jb25zdHJhaW50cy5wdXNoKG5ldyBEaXN0YW5jZUNvbnN0cmFpbnQoY29tcG9zaXRlLnBhcnRpY2xlc1t5KnNlZ21lbnRzK3hdLCBjb21wb3NpdGUucGFydGljbGVzW3kqc2VnbWVudHMreC0xXSwgc3RpZmZuZXNzKSk7XG5cblx0XHRcdGlmICh5ID4gMClcblx0XHRcdFx0Y29tcG9zaXRlLmNvbnN0cmFpbnRzLnB1c2gobmV3IERpc3RhbmNlQ29uc3RyYWludChjb21wb3NpdGUucGFydGljbGVzW3kqc2VnbWVudHMreF0sIGNvbXBvc2l0ZS5wYXJ0aWNsZXNbKHktMSkqc2VnbWVudHMreF0sIHN0aWZmbmVzcykpO1xuXHRcdH1cblx0fVxuXG5cdGZvciAoeD0wO3g8c2VnbWVudHM7Kyt4KSB7XG5cdFx0aWYgKHglcGluTW9kID09IDApXG5cdFx0Y29tcG9zaXRlLnBpbih4KTtcblx0fVxuXG5cdHRoaXMuY29tcG9zaXRlcy5wdXNoKGNvbXBvc2l0ZSk7XG5cdHJldHVybiBjb21wb3NpdGU7XG59XG5cblZlcmxldEpTLnByb3RvdHlwZS50aXJlID0gZnVuY3Rpb24ob3JpZ2luLCByYWRpdXMsIHNlZ21lbnRzLCBzcG9rZVN0aWZmbmVzcywgdHJlYWRTdGlmZm5lc3MpIHtcblx0dmFyIHN0cmlkZSA9ICgyKk1hdGguUEkpL3NlZ21lbnRzO1xuXHR2YXIgaTtcblxuXHR2YXIgY29tcG9zaXRlID0gbmV3IHRoaXMuQ29tcG9zaXRlKCk7XG5cblx0Ly8gcGFydGljbGVzXG5cdGZvciAoaT0wO2k8c2VnbWVudHM7KytpKSB7XG5cdFx0dmFyIHRoZXRhID0gaSpzdHJpZGU7XG5cdFx0Y29tcG9zaXRlLnBhcnRpY2xlcy5wdXNoKG5ldyBQYXJ0aWNsZShuZXcgVmVjMihvcmlnaW4ueCArIE1hdGguY29zKHRoZXRhKSpyYWRpdXMsIG9yaWdpbi55ICsgTWF0aC5zaW4odGhldGEpKnJhZGl1cykpKTtcblx0fVxuXG5cdHZhciBjZW50ZXIgPSBuZXcgUGFydGljbGUob3JpZ2luKTtcblx0Y29tcG9zaXRlLnBhcnRpY2xlcy5wdXNoKGNlbnRlcik7XG5cblx0Ly8gY29uc3RyYWludHNcblx0Zm9yIChpPTA7aTxzZWdtZW50czsrK2kpIHtcblx0XHRjb21wb3NpdGUuY29uc3RyYWludHMucHVzaChuZXcgRGlzdGFuY2VDb25zdHJhaW50KGNvbXBvc2l0ZS5wYXJ0aWNsZXNbaV0sIGNvbXBvc2l0ZS5wYXJ0aWNsZXNbKGkrMSklc2VnbWVudHNdLCB0cmVhZFN0aWZmbmVzcykpO1xuXHRcdGNvbXBvc2l0ZS5jb25zdHJhaW50cy5wdXNoKG5ldyBEaXN0YW5jZUNvbnN0cmFpbnQoY29tcG9zaXRlLnBhcnRpY2xlc1tpXSwgY2VudGVyLCBzcG9rZVN0aWZmbmVzcykpXG5cdFx0Y29tcG9zaXRlLmNvbnN0cmFpbnRzLnB1c2gobmV3IERpc3RhbmNlQ29uc3RyYWludChjb21wb3NpdGUucGFydGljbGVzW2ldLCBjb21wb3NpdGUucGFydGljbGVzWyhpKzUpJXNlZ21lbnRzXSwgdHJlYWRTdGlmZm5lc3MpKTtcblx0fVxuXG5cdHRoaXMuY29tcG9zaXRlcy5wdXNoKGNvbXBvc2l0ZSk7XG5cdHJldHVybiBjb21wb3NpdGU7XG59XG4iXX0=
;