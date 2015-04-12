var v = module.exports;

v.zero = function(){
	this.x = 0;
	this.y = 0;
	return this;
};

v.posinf = function(){
	this.x = Number.POSITIVE_INFINITY;
	this.y = Number.POSITIVE_INFINITY;
	return this;
};

v.neginf = function(){
	this.x = Number.NEGATIVE_INFINITY;
	this.y = Number.NEGATIVE_INFINITY;
	return this;
};

v.normalize = function(){
	var len = this.length();
	this.x /= len;
	this.y /= len;
	return this;
};

v.signum = function(){
	this.x = this.x>0?1:this.x<0?-1:0;
	this.y = this.y>0?1:this.y<0?-1:0;
	return this;
};

v.swap = function() {
	var temp = this.x;
	this.x = this.y;
	this.y = temp;
	return this;
};

v.abs = function(){
  this.x = Math.abs(this.x);
  this.y = Math.abs(this.y);
  return this;
};
