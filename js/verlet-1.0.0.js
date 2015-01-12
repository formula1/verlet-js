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
	var _this = this;
	Object.defineProperty(this,"asArray",{
		get:function(){
			return [_this.x,_this.y];
		}
	});
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

Vec2.prototype.toString = function() {
	return "(" + this.x + ", " + this.y + ")";
}

Vec2.overloaded = function(){
	if(arguments.length > 2){
		throw new Error("improper number of arguments");
	}
	if(arguments.length == 0){
		return new Vec2();
	}
	if(arguments.length == 2){
		if(typeof arguments[0] != "number" || typeof arguments[1] != "number"){
			throw new Error("2 numbers are required when providing 2 arguments");
		}
	}
	if(arguments.length == 1){
		if(arguments[0] instanceof Vec2){
			return arguments[0];
		}
		if(arguments[0].pos && arguments[0].pos instanceof Vec2){
			return arguments[0].pos;
		}
		if(Array.isArray(arguments[0])){
			if(x.length != 2){
				throw new Error("Vec2 needs an array of 2 when providing an array");
			}
			return Vec2.overloaded(arguments[0][0],arguments[0][1]);
		}
		throw new Error("for one argument, a Vec2, Particle or an Array is required");
	}
}

Vec2.overloadArguments = function(args,lengthTest,iterateTest){
	var len;
	if((len = lengthTest(args.length))){
		args = Array.prototype.slice.call(args,0);
	}else if(args.length == 1){
		if(!Array.isArray(args[0])){
			throw new Error("need either an Array or Arguments");
		}
		if(!(len = lengthTest(args[0].length))){
			throw new Error("improper number of arguments in array");
		}
		args = args[0].slice(0);
	}else{
		console.log(args.length);
		throw new Error("improper number of arguments");
	}
	for(var i=0;i<len;i++){
		args[i] = Vec2.overloaded(args[i])
		if(iterateTest) iterateTest(i,args);
	}
	return args;
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

},{}],7:[function(require,module,exports){
var Vec2 = require("./Vec2")

function Particle(pos) {
  this.pos = (new Vec2()).set(pos);
  this.lastPos = (new Vec2()).set(pos);
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

},{"../structures/Vec2":6}],12:[function(require,module,exports){
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
  this.points.forThree(function(prev,curr,next,i){
    var ok = true;
    var tri = new Triangle(prev,curr,next);
    if(tri.isConcave()){
      if(tri.hasPoint(_this.storedmid)){
        problem = true;
      }
      var intersections = _this.points.getIntersects(prev,curr,i);
      if(intersections.length > 0){
        //alert("you may get a negative area here");
        curr
          .sub(mid)
          .scale(diff)
          .add(mid);
        ok = false;
      }
    }
    if(ok){
      curr
        .sub(mid)
        .scale(diff)
        .add(mid);
    }
    if(curr != _this.points[0]){
      _this.storedarea += prev.cross(curr);
    }
    _this.storedmid.add(curr.clone().scale(1/l));
    _this.storedaabb.digestPoint(curr);
  })
  _this.storedarea += this.points[l-1].cross(this.points[0]);
}
AreaConstraint.prototype.draw = function(ctx) {
  var diff = Math.floor(Math.min(255,255*this.area/this.storedarea));
  var inv = Math.floor(Math.min(255,255*this.storedarea/this.area));
  ctx.beginPath();
  ctx.moveTo(this.points[0].x, this.points[0].y);
  var _this = this;
  var problem = false;
  var intersects = [];
  this.points.forThree(function(prev,curr,next,i){
    var tri = new Triangle(prev,curr,next);
    if(tri.isConcave()){
      if(tri.hasPoint(_this.storedmid)){
        problem = true;
      }
      var intersections = _this.points.getIntersects(prev,curr,i);
      if(intersections.length > 0){
//        alert("you may get a negative area here");
        intersects = intersects.concat(intersections);
      }
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

},{"../structures/AABB":15,"../structures/Polygon":14,"../structures/Triangle":13,"../structures/Vec2":6}],13:[function(require,module,exports){
var Vec2 = require("./Vec2");
var Circle = require("./Circle");


function Triangle(){
  var args = Vec2.overloadArguments(
    arguments,
    Triangle.lengthTest,
    Triangle.iterateTest
  )
  this.A = args[0];
  this.B = args[1];
  this.C = args[2];
}

Triangle.prototype.getCircumCircle = function(){
  return Triangle.getCircumCircle(this.A,this.B,this.C);
}

Triangle.prototype.isConcave = function(){
  return Triangle.isConcave(this.A,this.B,this.C);
}

Triangle.prototype.hasPoint = function(point){
  return Triangle.hasPoint(this.A,this.B,this.C,point);
}

Triangle.lengthTest = function(length){
  return (length == 3)?3:false;
}

Triangle.iterateTest = function(i,args){
  if(i == 0) return;
  if(args[i-1].equals(args[i])){
    throw new Error("Cannot build when argument["+(i-1)+"] == argument["+i+"]");
  }
}


Triangle.getCircumCircle = function(a,b,c){
  var x1 = a.x,
  y1 = a.y,
  x2 = b.x,
  y2 = b.y,
  x3 = c.x,
  y3 = c.y,
  fabsy1y2 = Math.abs(y1 - y2),
  fabsy2y3 = Math.abs(y2 - y3),
  xc, yc, m1, m2, mx1, mx2, my1, my2, dx, dy;
  /* Check for coincident points */
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

Triangle.hasPoint = function(a,b,c,point){
  //http://www.blackpawn.com/texts/pointinpoly/
  // Compute vectors
  var v0 = c.clone().sub(b);
  var v1 = a.clone().sub(b);
  var v2 = point.clone().sub(b);

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

Triangle.isConcave = function(a,b,c){
  //rotate the points around B to make B and A parrallel to the X axis
  //If the line BC is negative, it is Concave
  //If the line BC is positive, it is Convex

  var BAhyp = a.dist(b);
  var BAopp = a.y - b.y;

  var BArotate = Math.asin(BAopp/BAhyp);
  var Cnew = c.rotate(c,-BArotate);

  BCadj = Cnew.x - b.x;
  BCopp = Cnew.y - b.y;
  return BCopp < 0;
}

module.exports = Triangle;

},{"./Circle":16,"./Vec2":6}],15:[function(require,module,exports){
var Vec2 = require("./Vec2");

function AABB (){
  this.max = new Vec2(-Number.Infinity, -Number.Infinity);
  this.min = new Vec2(Number.Infinity,Number.Infinity);
}

AABB.prototype.digestPoint = function(point){
  this.max = this.max.max(point);
  this.min = this.min.min(point);
}


module.exports = AABB;

},{"./Vec2":6}],16:[function(require,module,exports){
var Vec2 = require("./Vec2");

function Circle(midpoint, radius){
  var args;
  if(typeof radius == "number"){
    this.radius = radius;
    this.midpoint = Vec2.overloaded(midpoint);
    return;
  }
  args = Vec2.overloadArguments(
    arguments,
    Circle.lengthTest
  );
  if(args.length == 2){
    this.midpoint = args[0].clone().add(args[1]).scale(1/2);
    this.radius = args[0].dist(args[1])/2;
  }else if(args.length == 3){
  }else{
    throw new Error("can only construct a Circle from 2 or 3 points or midpoint and radius");
  }

}

Circle.prototype.containsPoint = function(point){
  return this.midpoint.dist(point.pos) < radius;
}

Circle.prototype.hasPoint = function(){
  return this.midpoint.dist(point.pos) == radius;
}

Circle.prototype.getLineIntersection = function(line){
  //http://mathworld.wolfram.com/Circle-LineIntersection.html
  var lx = -line.xint.x;
  var ly = line.yint.y;
  var lr = Math.sqrt(ly*ly + lx+lx);
  cr = line.xint.cross(line.yint); //line.xint.x*line.yint.y + 0*0

  var r = this.radius

  var delta = r*r*dr*dr - cr*cr;
  // no intersection
  if(delta < 0) return false;
  lr = lr*lr; //reduce calculations
  // tangent line
  if(delta == 0) return [new Vec2( cr*ly/lr, -cr*lx/lr )];
  //reduce calculations
  delta = Math.sqrt(delta);
  var crly = cr*ly;
  var crlx = -cr*lx;
  var sigdel = Math.sig(ly)*lx * delta;
  var absdel = Math.abs(ly) * delta;
  return [
    new Vec2( (crly + sigdel) / lr, (crlx + absdel) / lr),
    new Vec2( (crly - sigdel) / lr, (crlx - absdel) / lr)
  ];
}

Circle.constructFrom2points = function(A,B){
  var midpoint = A.clone().add(B).scale(1/2);
  var radius = A.dist(B)/2;
  return new Circle(midpoint, radius);
}

Circle.constructFrom3points = function(A,B,C){
  var pbAB = (new Line(A, B)).getPerpendicularBisect();
  var pbCB = (new Line(C, B)).getPerpendicularBisect();
  var midpoint = pbAB.getIntersection(pbCB);
  var radius = A.dist(midpoint);
  return new Circle(midpoint, radius);
}


Circle.lengthTest = function(length){
  return (length == 2 || length == 3)?length:false;
}

module.exports = Circle;

},{"./Vec2":6}],17:[function(require,module,exports){
var Vec2 = require("./Vec2");


function Line(slope,intercept,boo){
  if(typeof arguments[0] == "number" && typeof arguments[1] == "number"){
    if(boo){
      this.inv_slope = slope;
      this.xint = intercept
      this.true_slope = 1/this.inv_slope;
      this.yint = -this.true_slope*this.xint;
    }else{
      this.true_slope = slope;
      this.yint = intercept
      this.inv_slope = 1/this.true_slope;
      this.xint = -this.inv_slope*this.yint;
    }
    this.limits = [new Vec2(0,yint),new Vec2(0,xint)];
    this.slope = this.limits[0].clone().sub(this.limits[1]);
    return;
  }
  var args = Vec2.overloadArguments(
    arguments,
    Line.lengthTest
  );
  if(args[0].equals(args[1])){
    throw new Error("Cannot create a line from equivalent values");
  }

  this.limits = [args[0], args[1]];
  this.mid = args[0].clone().add(args[1]).scale(1/2);
  this.slope = args[0].clone().sub(args[1]);
  this.inv_slope = (this.slope.y == 0)?false:this.slope.x/this.slope.y;
  this.true_slope = (this.slope.x == 0)?false:this.slope.y/this.slope.x;
  this.yint = -this.true_slope*args[0].x + args[0].y
  this.xint = -this.inv_slope*args[0].y + args[0].x
}

Line.prototype.length = function(){
  return this.limits[0].dist(this.limits[1]);
}

Line.prototype.getPerpendicularBisect = function(){
  var yint = -this.inv_slope*mid.x + mid.y;
  return new Line(this.inv_slope, yint);
}

Line.prototype.opposite = function(){
  return this.limits[1].y - this.limits[0].y;
}

Line.prototype.adjacent = function(){
  return this.limits[1].x - this.limits[0].x;
}


Line.prototype.getIntersection = function(B1,B2){

  var lineB = (B1 instanceof Line)?B1:new Line(B1,B2);

  // unlikely
  if(this.slope.equals(lineB.slope)) return false;

  var intersect = new Vec2();
  //This should take care of any special conditions
  if(this.slope.x === 0 || lineB.slope.x === 0){
    if(this.slope.x == lineB.slope.x) return false;
    if(this.slope.y === 0 || lineB.slope.y === 0){
      return new Vec2(
        (this.slope.x === 0)?this.xint:lineB.xint,
        (this.slope.y === 0)?this.yint:lineB.yint
      );
    }

    //I don't care which one is which
    var true_slope_A = this.inv_slope;
    var true_slope_B = lineB.inv_slope;
    //calculate in respect to X
    var bA = this.xint;
    var bB = lineB.xint;
    intersect.y = (bA-bB)/(true_slope_B-true_slope_A);
    intersect.x = true_slope_A*intersect.y + bA;
  }else{
    var true_slope_A = this.true_slope;
    var true_slope_B = lineB.true_slope;
    if(true_slope_A == true_slope_B) return false;
    var bA = this.yint;
    var bB = lineB.yint;
    intersect.x = (bA-bB)/(true_slope_B-true_slope_A);
    intersect.y = true_slope_A*intersect.x + bA;
  }
  return intersect;

}

Line.lengthTest = function(length){
  return (length == 2)?2:false;
}

Line.getIntersection = function(A1,A2,B1,B2){
  var slopeA = A1.clone().sub(A2);
  var slopeB = B1.clone().sub(B2);

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

},{"./Vec2":6}],14:[function(require,module,exports){

var Vec2 = require("./Vec2");
var Line = require("./Line");
var Circle = require("./Circle");
var Delaney = require("delaunay-fast")

function Polygon(points){
  if(arguments.length == 0){
    points = [];
  }
  if(points instanceof Polygon)
    return points;
  points = Vec2.overloadArguments(
    arguments,
    Polygon.lengthTest
  );
  for(var i in Polygon.prototype){
    Object.defineProperty(points,i,{
      enumerable: false,
      value:Polygon.prototype[i].bind(points)
    });
  }
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
  for(var i=skip||0;i<l;i++){
    var prev = (i+l-1)%l;//((i == 0)?l:i) -1
    var curr = i;
    var next = (i+1)%l; //i == l-1?0:i+1
    fn.call(this,this[prev],this[curr],this[next], curr);
  }
}

Polygon.prototype.getIntersects = function(tprev,tcurr,skip){
  //creating smaller aabbs
  //We're going to detect intersection by slope
  //however, the point of intersection may be outside of the of the possible area
  //as a result we're creating a smaller aabb thats the maxes and minimums of the current area

  var tAABB = {
    max: tprev.max(tcurr),
    min: tprev.min(tcurr)
  };
  var tAB_line = new Line(tprev,tcurr);

  var intersections = [];

  this.forThree(function(oprev,ocurr,onext){
    if(tcurr == ocurr) return;
    if(tcurr == oprev) return;
    if(oprev == tcurr) return;
    var oAABB = {
      max: oprev.max(ocurr),
      min: oprev.min(ocurr)
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
  var l = this.length;
  var mid = new Vec2();
  for(var i=this.length;i--;){
    mid.add(this[i].clone().scale(1/l));
  };
  return mid;
}

Polygon.prototype.getArea = function(){
  var net = 0;
  //http://www.wikihow.com/Calculate-the-Area-of-a-Polygon
  this.forThree(function(a,b,c){
    net += b.cross(c);
  })
  return net;
}

Polygon.prototype.getAABB = function(){
  var max = new Vec2(-Number.Infinity,-Number.Infinity);
  var min = new Vec2(Number.Infinity,Number.Infinity);
  for(var i=this.length;i--;){
    max = max.max(this[i]);
    min = min.min(this[i]);
  }
  return {max:max,min:min};
}

Polygon.prototype.getDelaney = function(){
  return Delaney.triangulate(this,"asArray");
}


Polygon.lengthTest = function(length){
  return (length>3)?length:false;
}

module.exports = Polygon;

},{"./Circle":16,"./Line":17,"./Vec2":6,"delaunay-fast":18}],18:[function(require,module,exports){
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