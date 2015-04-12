
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

module.exports = Vec2;

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
var temp;
temp = require("./to-value");

for(var i in temp){
	Vec2.prototype[i] = temp[i];
}

temp = require("./no-arg");

for(var i in temp){
	Vec2.prototype[i] = temp[i];
}

temp = require("./operations");

for(var i in temp){
	Vec2.prototype[i] = temp[i];
}


Vec2.prototype.clone = function(){
	return new Vec2(this.x,this.y);
};

Vec2.prototype.normal = function() {
	var m = Math.sqrt(this.x*this.x + this.y*this.y);
	return new Vec2(this.x/m, this.y/m);
};

Vec2.prototype.equals = function(v) {
	return this.x == v.x && this.y == v.y;
};

Vec2.prototype.epsilonEquals = function(v, epsilon) {
	return Math.abs(this.x - v.x) <= epsilon && Math.abs(this.y - v.y) <= epsilon;
};

Vec2.prototype.isNaN = function(){
	if(isNaN(this.x)) return true;
	if(isNaN(this.y)) return true;
	return false;
};

Vec2.prototype.toString = function() {
	return "(" + this.x + ", " + this.y + ")";
};

Vec2.prototype.toArray = function() {
	return [this.x,this.y];
};
