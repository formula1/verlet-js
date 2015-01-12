var Vec2 = require("../../lib/structures/Vec2");

var assert = function(label, expression) {
  console.log("Vec2(" + label + "): " + (expression == true ? "PASS" : "FAIL"));
  if (expression != true)
    throw "assertion failed";
};


var orig = new Vec2(4,4);

assert("equality", (new Vec2(5,3).equals(new Vec2(5,3))));
assert("epsilon equality", (new Vec2(1,2).epsilonEquals(new Vec2(1.01,2.02), 0.03)));
assert("epsilon non-equality", !(new Vec2(1,2).epsilonEquals(new Vec2(1.01,2.02), 0.01)));

var ops = {
  "addition":["add",[1,1],[new Vec2(2,3)],[3,4]],
  "subtraction":["sub",[3,4],[new Vec2(1,2)],[2,2]],
  "multiply":["mul",[2,2],[new Vec2(2,1)],[4,2]],
  "divide":["div",[4,2],[new Vec2(2,2)],[2,1]],
  "scale":["scale",[2,1],[3],[6,3]],
  "set":["set",[2,1],[new Vec2(2,0)],[2,0]],
  "rotate":["rotate",[2,0],[new Vec2(1,0), Math.PI/2],[1,1]]
};
for(var i in ops){
  var input = new Vec2(ops[i][1][0],ops[i][1][1]);
  var op = ops[i][0];
  var args = ops[i][2];
  var result = ops[i][3];
  assert(
    "basic "+i,
    input[op].apply(input,args).equals(new Vec2(result[0], result[1]))
  );
}
var mut = new Vec2(1,1);
for(var i in ops){
  var op = ops[i][0];
  var args = ops[i][2];
  var result = ops[i][3];
  mut[op].apply(mut,args);
  assert(
    "mutable "+i,
    mut.equals(new Vec2(result[0], result[1]))
  );
}
for(var i in ops){
  var orig = new Vec2(input[0],input[1]);
  var clone = orig.clone();
  var op = ops[i][0];
  var args = ops[i][2];
  var result = ops[i][3];
  clone[op].apply(clone,args);
  assert(
    "cloned "+i,
    orig.equals(new Vec2(input[0], input[1])) && clone.equals(new Vec2(result[0], result[1]))
  );
}

assert("length", (new Vec2(3,4)).length() == 5);
assert("length2", (new Vec2(3,4)).length2() == 25);
assert("dist", (new Vec2(0,4)).dist(new Vec2(3,0)) == 5);
assert("dist2", (new Vec2(0,4)).dist2(new Vec2(3,0)) == 25);

var normal = (new Vec2(3,4)).normal()
assert("normal", Math.abs(normal.length() - 1.0) <= 0.00001 && normal.epsilonEquals(new Vec2(3/5, 4/5), 0.0001));
assert("dot", (new Vec2(2,3)).dot(new Vec2(4,1)) == 11);
assert("cross", (new Vec2(2,3)).cross(new Vec2(4,1)) == -10);
assert("angle", (new Vec2(0,-1)).angle(new Vec2(1,0))*(180/Math.PI) == 90);
assert("angle2", (new Vec2(1,1)).angle2(new Vec2(1,0), new Vec2(2,1))*(180/Math.PI) == 90);
assert("toString", (new Vec2(2,4)) == "(2, 4)");
