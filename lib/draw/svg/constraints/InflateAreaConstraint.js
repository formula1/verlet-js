var Triangle = require("../../../structures/Triangle");
var Line = require("../../../structures/Line");
var generics = require('../generics');

module.exports = function(constraint){
constraint.prototype.draw = function(ctx) {
  if(!this.svgPolygon){
     this.svgPolygon = generics.polygon();

     this.svgMid = generics.circle(2);

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
  var _this = this;
  var problem = false;
  var intersects = [];
  var eq = false;
  var effectivepoints = [];
  //fill
  var l = this.points.length-1;
  var points = '';
  this.svgPolygon.svgReset();
  while(l--){
    this.svgPolygon.svgPoint(this.points[l]);
  }
  var g = (diff < inv)?diff:inv;
  this.svgPolygon.svgApply();
  this.svgPolygon.style.fill = "rgba("+diff+","+g+","+inv+",0.6)";

  //draw perimiter
  ctx.lineWidth = 4;
  this.points.forThree(function(prev,curr,next,i){
    if(curr.equals(next)){
      eq = eq||prev;
      return;
    }
    if(eq){
      prev = eq;
      eq = false;
    }
    effectivepoints.push(curr);
    var tri = new Triangle(prev,curr,next);

    var mp = tri.getConcaveBisector();

    var badarea = false;
    var stroke;
    if( tri.CA.pointIsLeftOrTop(mp.B) == tri.CA.pointIsLeftOrTop(tri.B)){
      stroke = "#FFFF00";
      if(tri.hasPoint(_this.storedmid)){
        problem = true;
      }
    }else{
      stroke = "#FF00FF";
      if(tri.partialArea < 0){
        badarea = true;
      }
    }
    var intersections = _this.points.intersectsLine(new Line(prev,curr),i);
    if(intersections.length > 0){
      //        alert("you may get a negative area here");
      intersects = intersects.concat(intersections);
    }
    var pl = generics.polyline(1,stroke);
    pl.svgPoint(prev.clone().add(curr).div(2));
    pl.svgPoint(curr);
    pl.svgPoint(curr.clone().add(next).div(2));
    pl.svgApply();
    _this.svgTriangles.push(pl);
    ctx.appendChild(pl);
  });

  for(var i=intersects.length;i--;){
    var int = generics.circle(8,intersects[i],"#FF8300");
    this.svgIntersections.push(int);
    ctx.appendChild(int);
  }

  this.svgMid.svgUpdate(this.storedmid);
  this.svgMid.style.fill = problem?"#FF0000":"#00FF00";
};
};