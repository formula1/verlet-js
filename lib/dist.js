
//this exports all the verlet methods globally, so that the demos work.

require("./verlet-polyfill");
var VerletDraw = require('./verlet-draw')
var VerletJS = require('./verlet')
var constraint = require('./constraint')
								 require('./objects') //patches VerletJS.prototype (bad)
window.Vec2 = require('./structures/Vec2')
window.VerletJS = VerletJS
window.VerletDraw = VerletDraw;

window.Particle = VerletJS.Particle

for(var i in constraint){
	window[i] = constraint[i]
}
