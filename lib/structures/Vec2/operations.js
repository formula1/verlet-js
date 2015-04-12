var v = module.exports;

v.add = function(v) {
	this.x += v.x;
	this.y += v.y;
	return this;
};

v.sub = function(v){
	this.x -= v.x;
	this.y -= v.y;
	return this;
};

v.mul = function(v) {
	if(typeof v == "number"){
		return this.scale(v);
	}
	this.x *= v.x;
	this.y *= v.y;
	return this;
};

v.div = function(v) {
	if(typeof v == "number"){
		return this.scale(1/v);
	}
	this.x /= v.x;
	this.y /= v.y;
	return this;
};

v.scale = function(coef) {
	this.x *= coef;
	this.y *= coef;
	return this;
};

v.scaleI = function(coef) {
	this.x /= coef;
	this.y /= coef;
	return this;
};


v.pow = function(num){
	this.x = Math.pow(this.x,num);
	this.y = Math.pow(this.y,num);
	return this;
};


v.rotate = function(origin, theta) {
	var x = this.x - origin.x;
	var y = this.y - origin.y;
	this.x = x*Math.cos(theta) - y*Math.sin(theta) + origin.x;
	this.y = x*Math.sin(theta) + y*Math.cos(theta) + origin.y;
	return this;
};

v.min = function(v){
	this.x = Math.min(this.x, v.x);
	this.y = Math.min(this.y, v.y);
	return this;
};

v.mid = function(v){
	this.x = (this.x+v.x)/2;
	this.y = (this.y+v.y)/2;
	return this;
};

v.max = function(v){
	this.x = Math.max(this.x, v.x);
	this.y = Math.max(this.y, v.y);
	return this;
};

v.set = function(v,y) {
  if(typeof y != "undefined"){
    this.x = v;
  	this.y = y;
  }else{
    this.x = v.x;
  	this.y = v.y;
  }
	return this;
};
