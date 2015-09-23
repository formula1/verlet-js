
window.requestAnimFrame = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
var VerletJS = require("../../verlet.js");
module.exports = VerletDraw;

require('./constraints/AngleConstraint')(require('../../constraints/AngleConstraint'));
require('./constraints/AreaConstraint')(require('../../constraints/AreaConstraint'));
require('./constraints/DistanceConstraint')(require('../../constraints/DistanceConstraint'));
require('./constraints/InflateAreaConstraint')(require('../../constraints/InflateAreaConstraint'));
require('./constraints/PinConstraint')(require('../../constraints/PinConstraint'));
require('./Particle');


function VerletDraw(svg, physics) {
  if(!svg) throw new Error('need an SVG Element');
  this.svg = svg;
  var width = svg.width.baseVal.value;
  var height = svg.height.baseVal.value;
  this.physics = (!physics)?new VerletJS(width,height):physics;


  this.mouse = new Vec2(0,0);
  this.mouseDown = false;
  this.draggedEntity = null;
  this.selectionRadius = 20;
  this.highlightColor = "#4f545c";
  this.selectorElement = document.createElement('circle');
  this.selectorElement.setAttribute('r','8');
  this.selectorElement.setAttribute('stroke',this.highlightColor);

  var _this = this;

  this.physics.logic = function(){
    // handle dragging of entities
    if (_this.draggedEntity)
      _this.draggedEntity.pos.set(_this.mouse);
  };


  // prevent context menu
  this.svg.oncontextmenu = function(e) {
    e.preventDefault();
  };

  this.svg.onmousedown = function(e) {
    _this.mouseDown = true;
    var nearest = _this.physics.nearestEntity(_this.mouse,_this.selectionRadius);
    if (nearest) {
      _this.draggedEntity = nearest;
      _this.svg.appendChild(_this.selectorElement);
    }
  };

  this.svg.onmouseup = function(e) {
    _this.mouseDown = false;
    if(_this.draggedEntity){
      _this.svg.removeChild(_this.selectorElement);
    }
    _this.draggedEntity = null;
  };

  this.svg.onmousemove = function(e) {
    var rect = _this.svg.getBoundingClientRect();
    _this.mouse.x = e.clientX - rect.left;
    _this.mouse.y = e.clientY - rect.top;
  };

}


VerletDraw.prototype.draw = function() {
  var i, c;

  var composites = this.physics.composites;
  for (c in composites) {
    // draw constraints
    if (composites[c].drawConstraints) {
      composites[c].drawConstraints(this.svg, composites[c]);
    } else {
      var constraints = composites[c].constraints;
      for (i in constraints){
        constraints[i].draw(this.svg);
      }
    }

    // draw particles
    if (composites[c].drawParticles) {
      composites[c].drawParticles(this.svg, composites[c]);
    } else {
      var particles = composites[c].particles;
      for (i in particles)
        particles[i].draw(this.svg);
    }

    if(composites[c].draw) composites[c].draw(this.svg);

  }

  // highlight nearest / dragged entity
  var nearest = this.draggedEntity || this.physics.nearestEntity(this.mouse,this.selectionRadius);
  if (nearest) {
    this.selectorElement.setAttribute('cx',nearest.pos.x);
    this.selectorElement.setAttribute('cy',nearest.pos.y);
  }
};
