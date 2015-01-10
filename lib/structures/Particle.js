var Vec2 = require("./Vec2")

function Particle(pos) {
  this.pos = (new Vec2()).mutableSet(pos);
  this.lastPos = (new Vec2()).mutableSet(pos);
  var _this = this;
  Object.defineProperty(this,"x",{
    get:function(){
      return _this.pos.x;
    },
    set:function(ny){
      _this.pos.x = nx;
    }
  })
  Object.defineProperty(this,"y",{
    get:function(){
      return _this.pos.y;
    },
    set:function(ny){
      _this.pos.y = ny;
    }
  })
}

Particle.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.arc(this.pos.x, this.pos.y, 2, 0, 2*Math.PI);
  ctx.fillStyle = "#2dad8f";
  ctx.fill();
}


module.exports = Particle;
