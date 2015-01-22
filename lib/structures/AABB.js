var Vec2 = require("./Vec2");
var Line = require("./Line");

function AABB (points){
  this.max = new Vec2().neginf();
  this.min = new Vec2().posinf();
  if(points){
    if(arguments.length > 1){
      var l = arguments.length;
      while(l--){this.digestPoint(arguments[l]);}
    }else{
      var l = points.length;
      while(l--){this.digestPoint(points[l]);}
    }
  }
}

AABB.prototype.digestPoint = function(point){
  this.max.max(point);
  this.min.min(point);
}

AABB.prototype.intersectsAABB = function(oAABB){
  if(this.min.x >= oAABB.max.x) return false;
  if(this.min.y >= oAABB.max.y) return false;
  if(oAABB.min.x >= this.max.x) return false;
  if(oAABB.min.y >= this.max.y) return false;
  return true;
}

AABB.prototype.sub = function(oAABB){
  this.min.max(oAABB.min);
  this.max.min(oAABB.max);
  return this;
}


AABB.prototype.getSuspects =function(particles){
  var lines = [];
  var inside = [];
  var done = [];
  var l = particles.length;
  var len = l;
  var xboo = false, yboo = false;
  var prev, temp, next;
  while(l--){
    xboo = (
      particles[l].pos.x <= this.max.x
    &&
      particles[l].pos.x >= this.min.x
    );
    yboo = (
      particles[l].pos.y <= this.max.y
      &&
      particles[l].pos.y >= this.min.y
    );
    if(xboo && yboo){
      temp = new Array(3);
      temp[0] = l

      prev = (l+len-1)%len;
      temp[1] = new Line(
        particles[prev].pos,
        particles[l].pos
      );
      if(done.indexOf(prev+"|"+l) == -1){
        lines.push([prev,l,temp[1]]);
        done.push(prev+"|"+l);
      }
      next = (l+1)%len;
      temp[2] = new Line(
        particles[l].pos,
        particles[next].pos
      );
      if(done.indexOf(l+"|"+next) == -1){
        lines.push([l,next,temp[2]]);
        done.push(l+"|"+next);
      }
      inside.push(temp);
      continue;
    }
    if(xboo || yboo){
      prev = (l+len-1)%len;
      if(done.indexOf(prev+"|"+l) == -1){
        temp = new Line(
          particles[prev].pos,
          particles[l].pos
        );
        if(this.intersectsLine(temp)){
          lines.push([prev,l,temp]);
        }
        done.push(prev+"|"+l)
      }
      next = (l+1)%len;
      if(done.indexOf(l+"|"+next) == -1){
        temp = new Line(
          particles[l].pos,
          particles[next].pos
        );
        if(this.intersectsLine(temp)){
          lines.push([l,next,temp]);
        }
        done.push(l+"|"+next)
      }
    }
  }
  return {inside:inside, lines:lines};
}


AABB.prototype.containsPoint = function(point){
  if(point.x >= this.max.x) return false;
  if(point.y >= this.max.y) return false;
  if(point.x <= this.min.x) return false;
  if(point.y <= this.min.y) return false;
  return true;
}

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
}


AABB.prototype.intersectsCircle = function(c){
  if(c.containsPoint(this.max)) return true;
  if(c.containsPoint(this.min)) return true;
  if(c.containsPoint(new Vec2(this.min.x,this.max.y))) return true;
  if(c.containsPoint(new Vec2(this.max.x,this.min.y))) return true;
  return false;
}

module.exports = AABB;
