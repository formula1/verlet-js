require("../../lib/verlet-polyfill");
var Time = require("../../lib/collision/time");
var Vec2 = require("../../lib/structures/Vec2");
var Line = require("../../lib/structures/Line");

var assert = function(label, expression) {
  console.log("Time(" + label + "): " + (expression === true ? "PASS" : "FAIL"));
  if (expression !== true) throw "assertion failed";
};

var lineA = {
  pos: new Vec2(-2,-2),
  vel: new Vec2(2,0)
};

var lineB = {
  pos: new Vec2(2,2),
  vel: new Vec2(-2,0)
};

var particle = {
  pos: new Vec2(0,2),
  vel: new Vec2(0,-1)
};

var t = Time.getImpacts(particle, lineA, lineB);
assert("FUTURE: number of intersection times", (t.length === 2));
assert("FUTURE: correct times", (t[0] === 1 && t[1] === 2));
assert("FUTURE: impossible values", !Time.restrict(t,4));
var l = 2;
var temp;
var temp2;
while(l--){
  temp = new Line(
    lineA.pos.clone().add(lineA.vel.clone().scale(t[l])),
    lineB.pos.clone().add(lineB.vel.clone().scale(t[l]))
  );
  temp2 = particle.pos.clone().add(particle.vel.clone().scale(t[l]));
  assert("FUTURE: line Intersects values", temp.intersectsPoint(temp2));
}

lineA = {
  pos: new Vec2(4,-2),
  vel: new Vec2(2,0)
};

lineB = {
  pos: new Vec2(-4,2),
  vel: new Vec2(-2,0)
};

particle = {
  pos: new Vec2(0,-1),
  vel: new Vec2(0,-1)
};

t = Time.getImpacts(particle, lineA, lineB);
assert("PAST: number of intersection times", (t.length === 2));
assert("PAST: correct times", (t[0] === -2 && t[1] === -1));
assert("PAST: min value", Time.restrict(t,4) === -2);
assert("PAST: restricted value", Time.restrict(t,1) === -1);
assert("PAST: not within timestamp", !Time.restrict(t,0.5));
var l = 2;
while(l--){
  temp = new Line(
    lineA.pos.clone().add(lineA.vel.clone().scale(t[l])),
    lineB.pos.clone().add(lineB.vel.clone().scale(t[l]))
  );
  temp2 = particle.pos.clone().add(particle.vel.clone().scale(t[l]));
  assert("Past: line Intersects values", temp.intersectsPoint(temp2));
}
