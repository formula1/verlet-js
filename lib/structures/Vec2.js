
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
