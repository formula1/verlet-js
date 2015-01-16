require("../../lib/verlet-polyfill");
var Line = require("../../lib/structures/Line");
var Vec2 = require("../../lib/structures/Vec2");

var assert = function(label, expression) {
  console.log("Line(" + label + "): " + (expression == true ? "PASS" : "FAIL"));
  if (expression != true)
    throw "assertion failed";
};

var orig = new Line(new Vec2(4,4), new Vec2(-4,-4));

assert("equality",
  (new Line(new Vec2(4,4), new Vec2(-4,-4))
  .equals(
    new Line(new Vec2(4,4), new Vec2(-4,-4))
  ))
);
assert("epsilon equality",
  (new Line(new Vec2(4,4), new Vec2(-4,-4))
  .epsilonEquals(
    new Line(new Vec2(4.01,4.02), new Vec2(-4.03,-4.04)),
    .05
  ))
);
assert("epsilon non-equality",
  !(new Line(new Vec2(4,4), new Vec2(-4,-4))
  .epsilonEquals(
    new Line(new Vec2(4.01,4.02), new Vec2(-4.03,-4.04)),
    .01
  ))
);
assert("slope intercept equality",
(new Line(new Vec2(4,4), new Vec2(-4,-4))
.equalSlope(
  new Line(new Vec2(8,8), new Vec2(5,5))
))
);
assert("slope intercept epsilon equality",
(new Line(new Vec2(4,4), new Vec2(-4,-4))
.epsilonEqualSlope(
  new Line(new Vec2(8.01,8.02), new Vec2(-8.03,-8.04)),
  .05
))
);

assert("perpendicular Bisector",
( new Line(new Vec2(2,4), new Vec2(-2,-4))
  .perpendicularBisector().equalSlope(
    new Line(new Vec2(4,-2), new Vec2(-4,2))
  )
)
);

assert("intersection Line",
( new Line(new Vec2(2,4), new Vec2(-2,-4))
.intersectsLine(new Line(new Vec2(4,-2), new Vec2(-4,2)))
.equals(new Vec2(0,0))
)
)
assert("intersection Point",
( new Line(new Vec2(2,4), new Vec2(-2,-4))
.intersectsPoint(new Vec2(0,0))
)
)

assert("Point is left",
( new Line(new Vec2(2,4), new Vec2(-2,-4))
.pointIsLeftOrTop(new Vec2(-1,0))
)
)
assert("Point is Above",
( new Line(new Vec2(2,0), new Vec2(-2,0))
.pointIsLeftOrTop(new Vec2(0,1))
)
)
assert("Point is right",
!( new Line(new Vec2(0,2), new Vec2(0,-2))
.pointIsLeftOrTop(new Vec2(1,0))
)
)
assert("Point is Above",
!( new Line(new Vec2(2,0), new Vec2(-2,0))
.pointIsLeftOrTop(new Vec2(0,-1))
)
)
