require("../../lib/verlet-polyfill");
var Vec2 = require("../../lib/structures/Vec2");
var Triangle = require("../../lib/structures/Triangle");

var assert = function(label, expression) {
  console.log("Triangle(" + label + "): " + (expression == true ? "PASS" : "FAIL"));
  if (expression != true)
    throw "assertion failed";
};


var orig = new Triangle(new Vec2(4,4), new Vec2(-4,4), new Vec2(-4,-4));

assert("equality",
(new Triangle(new Vec2(4,4), new Vec2(-4,4), new Vec2(-4,-4))
  .equals(new Triangle(new Vec2(4,4), new Vec2(-4,4), new Vec2(-4,-4))))
);
assert("epsilon equality",
(new Triangle(new Vec2(4,4), new Vec2(-4,4), new Vec2(-4,-4))
.epsilonEquals(
  new Triangle(new Vec2(4.01,4.02), new Vec2(-4.03,4.04), new Vec2(-4.05,-4.06))
  ,.07
))
);
assert("epsilon non-equality",
!(new Triangle(new Vec2(4,4), new Vec2(-4,4), new Vec2(-4,-4))
.epsilonEquals(
  new Triangle(new Vec2(4.01,4.02), new Vec2(-4.03,4.04), new Vec2(-4.05,-4.06))
  ,.01
))
);

assert("shape equality",
(new Triangle(new Vec2(4,4), new Vec2(-4,4), new Vec2(-4,-4))
.equalShape(new Triangle(new Vec2(4,4), new Vec2(4,-4), new Vec2(-4,-4))))
);
assert("epsilon shape equality",
(new Triangle(new Vec2(4,4), new Vec2(-4,4), new Vec2(-4,-4))
.epsilonEqualShape(
  new Triangle(new Vec2(4.01,4.02), new Vec2(4.03,-4.04), new Vec2(-4.05,-4.06))
  ,.07
))
);
assert("epsilon shape non-equality",
!(new Triangle(new Vec2(4,4), new Vec2(-4,4), new Vec2(-4,-4))
.epsilonEqualShape(
  new Triangle(new Vec2(4.01,4.02), new Vec2(4.03,-4.04), new Vec2(-4.05,-4.06))
  ,.01
))
);

assert("is acute",
(new Triangle(new Vec2(1,0), new Vec2(0,10), new Vec2(-1,0)).isAcute())
);

assert("is right",
(new Triangle(new Vec2(4,0), new Vec2(0,0), new Vec2(0,4)).isRight())
);

assert("is obtuse",
(new Triangle(new Vec2(10,0), new Vec2(0,1), new Vec2(-10,0)).isObtuse())
);

assert("has point",
(new Triangle(new Vec2(-2,-2), new Vec2(0,4), new Vec2(2,-2)).hasPoint(new Vec2(-0.5,-0.5)))
);
