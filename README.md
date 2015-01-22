verlet-js
=========

A simple Verlet (pronounced 'ver-ley') physics engine written in javascript.

Particles, distance constraints, and angular constraints are all supported by verlet-js.  From these primitives it is possible to construct just about anything you can imagine.

License
-------
You may use verlet-js under the terms of the MIT License (See [LICENSE](LICENSE)).


Examples
--------
1. [Shapes (verlet-js Hello world)](http://subprotocol.com/verlet-js/examples/shapes.html)
2. [Fractal Trees](http://subprotocol.com/verlet-js/examples/tree.html)
3. [Cloth](http://subprotocol.com/verlet-js/examples/cloth.html)
4. [Spiderweb](http://subprotocol.com/verlet-js/examples/spiderweb.html)


Code Layout
-----------
1. js/verlet-js/vec2.js: _2d vector implementation_
2. js/verlet-js/constraint/: _constraint code_
3. js/verlet-js/verlet.js: _verlet-js engine_
4. js/verlet-js/objects.js: _shapes and objects (triangles, circles, tires..)_

# Build for npm

``` js
npm run build
```

for automated building

``` js
npm run watch-build-test
```

# Areas where speed might be able to be increased

* Line/intersects#28 - I can compile the maxes and minimums before hand
* any file that is named cachable can make lazy and store the information after
* changing loops in verlet.js from `for( in )` to `while(i--)`


# Known Issues and the possible solutions

* Problem: Constraints are applied after other constraints get applied
* Solution: make each constraint only return a transform and apply them after all others do
* Problem: Constraints that will force the particle in the same direction get applied ontop of eachother
* Solution: Create a Governer Constraint that creates an average of all transforms done to each particle
* Problem: Area Constraints cannot detect negative area
* Solution: ??
* Problem: Particles May tunnel
* Solution: Make the Collision solver equation based
* Problem: Collisions don't account for accelleration when solving the points new position
* Solution: Make the collision solver equation based
* Problem: Collisions don't solve lateral collisions (p goes behind ab)
* Solution: look for when the lines intersect
* Problem: Collision Solving only solves found collisions in timestep
* Solution: Collision solver goes backward in time to first collision then searches
* Problem: Collisions don't account for area behind a surface area
* Solution: ??
* Problem: points never rest
* Solution: ??
