require("../../lib/verlet-polyfill");
var Momentum = require("../../lib/collision/momentum");
var Vec2 = require("../../lib/structures/Vec2");

var assert = function(label, expression) {
  console.log("Momentum(" + label + "): " + (expression === true ? "PASS" : "FAIL"));
  if (expression !== true) throw "assertion failed";
};


var lineA = {
  pos: new Vec2(4,0),
  vel: new Vec2(0,0)
};

var lineB = {
  pos: new Vec2(-4,0),
  vel: new Vec2(-1,0)
};

var particle = {
  pos: new Vec2(-3,-1),
  vel: new Vec2(0,-1)
};

Momentum.distributeVelocities(particle,lineA,lineB, -1);
console.log(
  particle.vel +
  lineA.vel +
  lineB.vel
);

assert("Hit the edge",
  particle.vel.equals(new Vec2(-0.5,-0.5)) &&
  lineA.vel.equals(new Vec2(0,0)) &&
  lineB.vel.equals(new Vec2(-0.5,-0.5))
);

var lineA = {
  pos: new Vec2(4,-2),
  vel: new Vec2(2,0)
};

var lineB = {
  pos: new Vec2(-4,2),
  vel: new Vec2(-2,0)
};

var particle = {
  pos: new Vec2(0,-1),
  vel: new Vec2(0,-1)
};

Momentum.distributeVelocities(particle,lineA,lineB, -1);

console.log(
  particle.vel +
  lineA.vel +
  lineB.vel
);
assert("Hit middle of line",
particle.vel.equals(new Vec2(0,-0.5)) &&
lineA.vel.equals(new Vec2(2,-0.5)) &&
lineB.vel.equals(new Vec2(-2,-0.5))
);
