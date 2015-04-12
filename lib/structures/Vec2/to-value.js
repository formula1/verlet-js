
var v = module.exports;

v.length = function() {
	return Math.sqrt(this.x*this.x + this.y*this.y);
};

v.length2 = function() {
	return this.x*this.x + this.y*this.y;
};

v.slope = function(){
	return this.y / this.x;
};

v.sum = function(){
	return this.y + this.x;
};

v.dist = function(v) {
	return Math.sqrt(this.dist2(v));
};

v.dist2 = function(v) {
	var x = v.x - this.x;
	var y = v.y - this.y;
	return x*x + y*y;
};

v.dot = function(v) {
	return this.x*v.x + this.y*v.y;
};

v.cross = function(v){
	return this.x * v.y - this.y * v.x;
};

v.angle = function(vl,vr) {
	if(vr) return this.angle2(vl,vr);
	if(vl) return this.angle1(vl);
	return Math.atan2(this.x,this.y);
};

v.angle1 = function(v) {
	return Math.atan2(this.x*v.y-this.y*v.x,this.x*v.x+this.y*v.y);
};

v.angle2 = function(vLeft, vRight) {
	return vLeft.clone().sub(this).angle(vRight.clone().sub(this));
};
