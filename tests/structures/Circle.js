require("../../lib/verlet-polyfill");
var Circle = require("../../lib/structures/Circle");
var Line = require("../../lib/structures/Line");
var Vec2 = require("../../lib/structures/Vec2");

var assert = function(label, expression) {
  console.log("Circle(" + label + "): " + (expression == true ? "PASS" : "FAIL"));
  if (expression != true)
    throw "assertion failed";
};


var orig = new Circle(new Vec2(4,4),4);

assert("equality",(new Circle(new Vec2(5,3),3).equals(new Circle(new Vec2(5,3),3))));
assert("epsilon equality", (new Circle(new Vec2(1,2),3).epsilonEquals(new Circle(new Vec2(1.01,2.02),3.03), 0.04)));
assert("epsilon non-equality", !(new Circle(new Vec2(1,2),3).epsilonEquals(new Circle(new Vec2(1.01,2.02),3.03), 0.01)));

assert("construct from 2 points",
  Circle.construct2(new Vec2(3,1),new Vec2(-1,1))
  .equals(new Circle(new Vec2(1,1),2))
);

assert("construct from 3 points",
  Circle.construct3(new Vec2(-2,5),new Vec2(4,5),new Vec2(1,6))
  .epsilonEquals(new Circle(new Vec2(1,1),5),0.0001)
);


assert("Contains Point", (new Circle(new Vec2(0,0),1)).containsPoint(new Vec2(0.5,-0.5)));

assert("intersects Point", (new Circle(new Vec2(1,0),1)).intersectsPoint(new Vec2(2,0)));


var temp = (new Circle(new Vec2(2,2),3)).intersectsLine(new Line(new Vec2(2,8),new Vec2(2,0)));
assert("2 intersects on line",
(temp[0].equals(new Vec2(2,5)) && temp[1].equals(new Vec2(2,-1)))
||(temp[1].equals(new Vec2(2,5)) && temp[0].equals(new Vec2(2,-1)))
);

temp = (new Circle(new Vec2(2,2),3)).intersectsLine(new Line(new Vec2(0,-1),new Vec2(10,-1)));
assert("1 intersects on line", temp[0].equals(new Vec2(2,-1)) );

temp = (new Circle(new Vec2(2,2),3)).intersectsLine(new Line(new Vec2(0,10),new Vec2(10,10)));
assert("0 intersects on line", !temp );


temp =
  Circle.construct3(new Vec2(-3,-4),new Vec2(3,4),new Vec2(-5,0))
.intersectsCircle(
  Circle.construct3(new Vec2(-3,-4),new Vec2(3,4),new Vec2(5,0))
);
assert("2 intersects between circle",
  temp
  &&(
    (   temp[0].epsilonEquals(new Vec2(-3,-4),0.00001)
    &&  temp[1].epsilonEquals(new Vec2(3,4),0.00001))
  ||
    (   temp[1].epsilonEquals(new Vec2(-3,-4),0.00001)
    &&  temp[0].epsilonEquals(new Vec2(3,4),0.00001))
  )
);

temp =   Circle.construct2(new Vec2(0,0),new Vec2(2,2))
.intersectsCircle(
  Circle.construct2(new Vec2(0,0),new Vec2(-3,-4))
);
console.log(temp);
assert("1 intersects between circle", temp&&temp[0].epsilonEquals(new Vec2(0,0),0.1) );

temp = (new Circle(new Vec2(2,0),1)).intersectsCircle(new Circle(new Vec2(-2,0),1));
assert("0 intersects between circle", !temp );
