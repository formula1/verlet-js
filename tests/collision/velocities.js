require("../../lib/verlet-polyfill");
var Momentum = require("../../lib/collision/velocities");
var Vec2 = require("../../lib/structures/Vec2");

var assert = function(label, expression) {
  console.log("Velocties(" + label + "): " + (expression === true ? "PASS" : "FAIL"));
  if (expression !== true) throw "assertion failed";
};


var silent_assert = function(label, expression) {
  if (expression !== true){
    console.log("Velocties(" + label + "): " + "FAIL");
    throw "assertion failed";
  }
};



var lineA = {
  pos: new Vec2(4,0),
  vel: new Vec2(0,-2)
};

var lineB = {
  pos: new Vec2(-4,0),
  vel: new Vec2(0,-2)
};

var particle = {
  pos: new Vec2(0,0),
  vel: new Vec2(0,-2)
};




var vels = Momentum.getVelocities(lineA,lineB, 1);
console.log(
  particle.vel +
  lineA.vel +
  lineB.vel
);
console.log(
  vels.linearvel +
  vels.expandvel +
  vels.rotatevel
);

assert("Parrallel Linear Velocity",
  vels.linearvel.equals(new Vec2(0,-2))
);
assert("No Expansive Velocity",
  vels.expandvel === 0
);
assert("No Rotational Velocity",
  vels.rotatevel === 0
);


var pi2 = Math.PI*2;
var anglediff = Math.PI/12;
var linv = new Vec2();
var linm = 2;
var n = new Vec2();
var length1=5,length2=5;

lineA = {
  pos: new Vec2(),
  vel: new Vec2()
};

lineB = {
  pos: new Vec2(),
  vel: new Vec2()
};

particle = {
  pos: new Vec2(),
  vel: new Vec2()
};

var curang = 0;
var velang = 0;
while(curang < pi2){
  n.set(Math.cos(curang),Math.sin(curang));
  var x = Math.cos(curang)*length1;
  var y = Math.sin(curang)*length1;
  lineA.pos.set(n.clone().mul(length1));
  lineB.pos.set(n.clone().mul(-length1));
  velang = 0;
  while(velang < pi2){
    linv.set(Math.cos(velang),Math.sin(velang)).mul(linm);
    lineA.vel.set(linv);
    lineB.vel.set(linv);
    var vels = Momentum.getVelocities(lineA,lineB, 1);
    silent_assert("Linear Velocity Equals",
      linv.epsilonEquals(vels.linearvel,0.0001)
    );
    silent_assert("No Expansive Velocity",
      vels.expandvel === 0
    );
    silent_assert("No Rotational Velocity",
      vels.rotatevel === 0
    );
    velang += anglediff;
  }
  assert(
    " Line at Angle("+curang+") Completion",
    velang >= pi2
  );
  curang += anglediff;
}


lineA = {
  pos: new Vec2(4,0),
  vel: new Vec2(-1,-2)
};

lineB = {
  pos: new Vec2(-4,0),
  vel: new Vec2(1,-2)
};

particle = {
  pos: new Vec2(0,0),
  vel: new Vec2(0,-2)
};

console.log(
  particle.vel +
  lineA.vel +
  lineB.vel
);

var vels = Momentum.getVelocities(lineA,lineB, 1);

console.log(
  vels.linearvel +
  vels.expandvel +
  vels.rotatevel
);

assert("Parrallel Linear Velocity",
  vels.linearvel.equals(new Vec2(0,-2))
);
assert("No Expansive Velocity",
  vels.expandvel.equals(new Vec2(-1,0))
);
assert("No Rotational Velocity",
  vels.rotatevel === 0
);
