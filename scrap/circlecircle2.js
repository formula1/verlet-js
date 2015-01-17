//http://stackoverflow.com/questions/12219802/a-javascript-function-that-returns-the-x-y-points-of-intersection-between-two-ci
//because my custom code wouldn't produce correct results : /
console.log(this)
console.log(circle)
var c1r = this.radius;
var c2r = circle.radius;
//Calculate distance between centres of circle
var d =this.midpoint.dist(circle.midpoint);
var m = c1r + c2r;
var n = c1r - c2r;

if (n < 0) n = n * -1;
//No solns
if ( d > m )
  return false;
  //Circle are contained within each other
  if ( d < n )
    return false;
    //Circles are the same
    if ( d == 0 && c1r == c2r )
      return true;
      //Solve for a
      var a = ( c1r * c1r - c2r * c2r + d * d ) / (2 * d);
      console.log(a);
      console.log(c2r);
      //Solve for h
      var h = Math.sqrt( c1r * c1r - a * a );

      var middiff = circle.midpoint.clone().sub(this.midpoint);
      //Calculate point p, where the line through the circle intersection points crosses the line between the circle centers.
      var p = this.midpoint.clone().scale(a/d).mul(middiff);

      //1 soln , circles are touching
      if ( d == c1r + c2r ) {
        return [p];
      }
      middiff.swap().scale(h/d);
      //2solns
      var p1 = p.clone().add(new Vec2(1,-1).mul(middiff));
      var p2 = p.clone().add(new Vec2(-1,1).mul(middiff));;

      return [p1,p2];
