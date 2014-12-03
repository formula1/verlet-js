
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
