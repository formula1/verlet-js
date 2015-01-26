var Vec2 = require("./Vec2");
var Line = require("./Line");

function AABB (points){
  this.max = new Vec2().neginf();
  this.min = new Vec2().posinf();
  if(points){
    var l;
    if(arguments.length > 1){
      l = arguments.length;
      while(l--){this.digestPoint(arguments[l]);}
    }else{
      l = points.length;
      while(l--){this.digestPoint(points[l]);}
    }
  }
}

AABB.prototype.toArray = function(){
  return this.min.toArray().concat(this.max.toArray());
};

AABB.prototype.clear = function(){
  this.max.neginf();
  this.min.posinf();
};

AABB.prototype.digestPoint = function(point){
  this.max.max(point);
  this.min.min(point);
};

AABB.prototype.intersectsAABB = function(oAABB){
  if(this.min.x >= oAABB.max.x) return false;
  if(this.min.y >= oAABB.max.y) return false;
  if(oAABB.min.x >= this.max.x) return false;
  if(oAABB.min.y >= this.max.y) return false;
  return true;
};

AABB.prototype.sub = function(oAABB){
  this.min.max(oAABB.min);
  this.max.min(oAABB.max);
  return this;
};


AABB.prototype.getSuspects =function(particles){
  var lines = [];
  var inside = [];
  var done = [];
  var l = particles.length;
  var len = l;
  var xboo = false, yboo = false;
  var temp, ari, ll;
  while(l--){
    xboo = (  particles[l].pos.x <= this.max.x &&
              particles[l].pos.x >= this.min.x );
    yboo = (  particles[l].pos.y <= this.max.y &&
              particles[l].pos.y >= this.min.y );
    if(!xboo && !yboo) continue;
    if(xboo && yboo){
      inside.push(l);
    }
    ari = [[(l+len-1)%len,l], [l, (l+1)%len]];
    ll = 2;
    while(ll--){
      if(done.indexOf(ari[ll].join("|")) !== -1) continue;
      done.push(ari[ll].join("|"));
      var p1 = particles[ari[ll][0]].pos;
      var p2 = particles[ari[ll][1]].pos;
      if(this.containsPoint(p1) || this.containsPoint(p2)){
        lines.push(ari[ll]);
        continue;
      }
      temp = new AABB(p1, p2);
      if(!this.intersectsAABB(temp)) continue;
      temp = new Line(p1,p2);
      if(!this.intersectsLine(temp)) continue;
      lines.push(ari[ll]);
    }
  }
  return {inside:inside, lines:lines};
};


AABB.prototype.containsPoint = function(point){
  if(point.x > this.max.x) return false;
  if(point.y > this.max.y) return false;
  if(point.x < this.min.x) return false;
  if(point.y < this.min.y) return false;
  return true;
};

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
};


AABB.prototype.intersectsCircle = function(c){
  if(c.containsPoint(this.max)) return true;
  if(c.containsPoint(this.min)) return true;
  if(c.containsPoint(new Vec2(this.min.x,this.max.y))) return true;
  if(c.containsPoint(new Vec2(this.max.x,this.min.y))) return true;
  return false;
};

module.exports = AABB;
