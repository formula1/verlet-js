var Vec2 = require("../Vec2");
var Line = require("../Line");


function Triangle(A,B,C){
  if(A.equals(B) || B.equals(C) || C.equals(A))
    throw new Error("cannot create triangle when two points are the same")
  this.A = A;
  this.B = B;
  this.C = C;
  this.AB = new Line(A,B);
  this.BC = new Line(B,C);
  this.CA = new Line(C,A);
  this.ABC = Math.lawCos(this.CA.length, this.AB.length, this.BC.length);
  this.BCA = Math.asin(Math.sin(this.ABC)*this.CA.length/this.AB.length);
  this.CAB = Math.asin(Math.sin(this.ABC)*this.BC.length/this.AB.length);
  this.perimiter = this.AB.length + this.BC.length + this.CA.length
  this.partialArea = this.AB.cross + this.BC.cross + this.CA.cross
  this.area = Math.abs(this.partialArea);
}


var interesctions = require("./intersections.js");

for(var i in interesctions){
  Triangle.prototype[i] = interesctions[i];
}

var questions = require("./questions.js");

for(var i in questions){
  Triangle.prototype[i] = questions[i];
}

var constructs = require("./construct.js");

for(var i in constructs){
  Triangle.prototype[i] = constructs[i];
}


module.exports = Triangle;
