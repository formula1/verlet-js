var AABB = require("./AABB");
var EE = require("events").EventEmitter;

function Composite() {
  EE.call(this);
  this.particles = [];
  this.constraints = [];
  this.aabb = new AABB();

  this.drawParticles = null;
  this.drawConstraints = null;
}

Composite.prototype = Object.create(EE);
Composite.prototype.constructor = Composite;

Composite.prototype.addParticle = function(particle){
  this.particles.puch(particle);
  particle.on('collision',this.emit.bind(this,'collision'));
};

Composite.prototype.pin = function(index, pos) {
  pos = pos || this.particles[index].pos;
  var pc = new PinConstraint(this.particles[index], pos);
  this.constraints.push(pc);
  return pc;
};

module.exports = Composite;
