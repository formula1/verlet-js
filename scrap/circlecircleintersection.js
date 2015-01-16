//http://math.stackexchange.com/questions/256100/how-can-i-find-the-points-at-which-two-circles-intersect
/*
(x−m.x)2+(y−m.y)2=r2
- (x−m.x)2+(y-m.y)2=r2
= intersects

x2−2x*m.x+m.x2+y2-2y*m.y+m.y2 - r2
- x2−2x*m.x+m.x2+y2-2y*m.y+m.y2 - r2
= intersects

−2x*m.x+m.x2 -2y*m.y+m.y2 - r2
- (−2x*m.x+m.x2 -2y*m.y+m.y2 - r2)
= intersects

−2x*m.x + m.x2 + 2x*n.x - n.x2
-2y*m.y + m.y2  + 2y*n.y - n.y2
- r2 + rr2
= intersects

−2x*m.x + 2x*n.x
-2y*m.y + 2y*n.y
- r2 + rr2 + m.x2 - n.x2 + m.y2 - n.y2
= intersects

2x((n.x) - (m.x)) + 2y((n.y) - (m.y))
- r2 + rr2 + m.x2 + m.y2 - n.x2 - n.y2
= intersects

x((n.x) - (m.x)) + y((n.y) - (m.y))
= intersects

d = {x:n.x-m.x, y:n.y-m.y};
offset = (-r2 + rr2 + m.x2 + m.y2 - n.x2 - n.y2)/2
x*d.x + y*d.y + offset = 0;
*/
var mid = this.midpoint;
var nid = circle.midpoint;
var offset = mid.clone().pow(2).sub(nid.clone().pow(2));
offset = -this.radius*this.radius
+ circle.radius*circle.radius
+ offset.x + offset.y;
offset /= 2;
var slope = nid.clone().sub(mid);
/*
r2 = (x-m.x)2 + (y-m.y)2
x*d.x + y*d.y + offset = 0;
y = -(x*d.x + offset)/d.y
x = -(y*d.y + offset)/d.x

r2 = (x-m.x)2 + (-(x*d.x + offset)/d.y - m.y)2

r2 = x2 - 2*x*m.x + m.x2
+ (-(x*d.x + offset)/d.y)2 - 2*(-(x*d.x + offset)/d.y)*m.y + m.y2

r2 = x2 - 2*x*m.x + m.x2
+ (-x*d.x/d.y - offset/d.y)2
- 2*(-(x*d.x + offset)/d.y)*m.y + m.y2

r2 = x2 - 2*x*m.x + m.x2
+ (-x*d.x/d.y - offset/d.y)2
- 2*(-(x*d.x + offset)/d.y)*m.y + m.y2

r2 = x2 - 2*x*m.x + m.x2
+ (-x*d.x/d.y)2 + 2*(-x*d.x/d.y)*(-offset/d.y) + (offset/d.y)2
- 2*(-(x*d.x + offset)/d.y)*m.y + m.y2

r2 = x2 + (-x*d.x/d.y)2
- 2*x*m.x + 2*(-x*d.x/d.y)*(-offset/d.y) - 2*(-(x*d.x + offset)/d.y)*m.y
+ m.y2 + m.x2 + (-offset/d.y)2

r2 = x2(1 - d.x2/d.y2)
- 2*x*m.x + 2*(x*d.x/d.y)*(offset/d.y) + 2*x*m.y*d.x/d.y + 2*offset*m.y/d.y
+ m.y2 + m.x2 + (-offset/d.y)2

r2 = x2(1 - d.x2/d.y2)
- 2*x*m.x + 2*(x*d.x/d.y)*(offset/d.y) + 2*x*m.y*d.x/d.y
+ m.y2 + m.x2 + (-offset/d.y)2 + 2*offset*m.y/d.y

r2 = x2(1 - d.x2/d.y2)
2x( -m.x + (d.x/d.y)*(offset/d.y) + m.y*d.x/d.y )
+ m.y2 + m.x2 + (-offset/d.y)2 + 2*offset*m.y/d.y

a = (1 - d.x2/d.y2)
b = 2( -m.x + (d.x/d.y)*(offset/d.y) + m.y*d.x/d.y )
c = m.y2 + m.x2 + (-offset/d.y)2 + 2*offset*m.y/d.y

var is = d.x/d.y;
var off_dy = offset/d.y;

a = (1 - is2)
b = 2( -m.x + (is)*(off_dy) + m.y*is )
c = m.y2 + m.x2 + (-off_dy)2 + 2*off_dy*m.y



*/
if(slope.y == 0){
  slope.swap();
  mid.swap();
}
var islope = slope.clone().swap().slope();
var off_dy = offset/slope.y;
var a = (1 - islope*islope);
var b = 2*(-mid.x + islope*(off_dy + mid.y));
var c = mid.clone().pow(2).sum() + Math.pow(-off_dy,2) + 2*off_dy*mid.y;
console.log(a+", "+b+", "+c);
var cords = Math.quadratic(a,b,c);
console.log(cords);
if(!cords) return false;
var l = cords.length
if(slope.x == 0){
  while(l--){
    cords[l] = new Vec2(-offset/slope.y, cords[l]).swap();
  }
}else{
  while(l--){
    cords[l] = new Vec2(offset/slope.y, cords[l])
  }
}
return cords;
