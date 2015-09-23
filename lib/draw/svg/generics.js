module.exports.circle = function(r,center,fill){
  var circle = document.createElement('circle');
  circle.setAttribute('r',r);
  if(center){
    circle.setAttribute('cx',center.x);
    circle.setAttribute('cy',center.y);
  }
  if(fill) circle.style.fill = fill;
  circle.svgUpdate = function(center){
    circle.setAttribute('cx',center.x);
    circle.setAttribute('cy',center.y);
  };
  return circle;
};

module.exports.polygon = function(width, color, fill){
  var poly = document.createElement('polygon');
  var points = '';
  if(width) poly.style['stroke-width'] = width;
  if(color) poly.style.stroke = color;
  if(fill) poly.style.fill = fill;
  poly.svgReset = function(){
    points = '';
  };
  poly.svgPoint = function(p){
    points += Math.round(p.x)+','+Math.round(p.y)+' ';
  };
  poly.svgApply = function(){
    poly.setAttribute('points',points);
  };
  return poly;
};

module.exports.polyline = function(width, color, fill){
  var poly = document.createElement('polyline');
  var points = '';
  if(width) poly.style['stroke-width'] = width;
  if(color)poly.style.stroke = color;
  if(fill) poly.style.fill = fill;
  poly.svgReset = function(){
    points = '';
  };
  poly.svgPoint = function(p){
    points += Math.round(p.x)+','+Math.round(p.y)+' ';
  };
  poly.svgApply = function(){
    poly.setAttribute('points',points);
  };
  return poly;
};


module.exports.line = function(a,b, width, color){
  var line = document.createElement('line');
  if(width) line.style['stroke-width'] = width;
  if(color) line.style.stroke = color;
  line.setAttribute('x1', a.x);
  line.setAttribute('y1', a.y);
  line.setAttribute('x2', b.x);
  line.setAttribute('y2', b.y);
  line.svgUpdate = function(a,b){
    line.setAttribute('x1', a.x);
    line.setAttribute('y1', a.y);
    line.setAttribute('x2', b.x);
    line.setAttribute('y2', b.y);
  };
  return line;
};