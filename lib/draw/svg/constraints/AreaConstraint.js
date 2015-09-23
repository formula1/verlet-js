var Triangle = require("../../../structures/Triangle");
var Line = require("../../../structures/Line");
var generics = require('../generics');

module.exports = function(constraint){
constraint.prototype.draw = function(ctx) {

  if(!this.svgPolygon){
     this.svgPolygon = generics.polygon();
     this.svgMid = generics.circle(2);
     this.svgMid.setAttribute('r','2');

     ctx.appendChild(this.svgPolygon);
     ctx.appendChild(this.svgMid);

     this.svgTriangles = [];
     this.svgIntersections = [];

  }else{
    this.svgTriangles.forEach(function(tri){
      ctx.removeChild(tri);
    });
    this.svgIntersections.forEach(function(tri){
      ctx.removeChild(tri);
    });
    this.svgTriangles = [];
    this.svgIntersections = [];
  }

  var diff = Math.floor(Math.min(255,255*this.area/this.storedarea));
  var inv = Math.floor(Math.min(255,255*this.storedarea/this.area));
  ctx.beginPath();
  this.svgPolygon.svgReset();
  this.svgPolygon.svgPoint(this.points[0]);
  var _this = this;
  var problem = false;
  var intersects = [];
  var eq = false;
  this.points.forThree(function(prev,curr,next,i){
    /*
    if(curr.equals(next)){
      eq = prev
      return;
    }
    if(eq){
      prev = eq;
      eq = false;
    }
    */
    var tri = new Triangle(prev,curr,next);
    if(tri.isConcave()){
      if(tri.hasPoint(_this.storedmid)){
        problem = true;
      }
    }
    var intersections = _this.points.getIntersects(prev,curr,i);
    if(intersections.length > 0){
      //        alert("you may get a negative area here");
      intersects = intersects.concat(intersections);
    }
    this.svgPolygon.svgPoint(curr);
  });

  var g = (diff < inv)?diff:inv;
  this.svgPolygon.svgApply();
  this.svgPolygon.style.fill = "rgba("+diff+","+g+","+inv+",0.6)";


  for(var i=intersects.length;i--;){
    var int = generics.circle(8,intersects[i],"#FF8300");
    this.svgIntersections.push(int);
    ctx.appendChild(int);
  }

  var tris = this.points.getDelaney();
  for(i = tris.length; i; ) {
    var tri = generics.polygon(1,'white');
    --i; tri.svgPoint(this.points[tri[i]]);
    --i; tri.svgPoint(this.points[tri[i]]);
    --i; tri.svgPoint(this.points[tri[i]]);
    tri.svgApply();
    this.svgTriangles.push(tri);
    ctx.appendChild(tri);
  }

  this.svgMid.svgUpdate(this.storedmid);
  this.svgMid.style.fill = problem?"#FF0000":"#00FF00";
};
};