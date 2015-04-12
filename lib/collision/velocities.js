
function getVelocities(A1,B1,time){
  //Getting the midpoint between the points before velocities
  var M1 = A1.pos.clone().mid(B1.pos);
  //Getting the "angle" before vels, if one is 0, we need to divide the other
  var Ang1 = A1.pos.clone().sub(B1.pos);
  //Getting the distance before vels
  var D1 = A1.pos.dist(B1.pos);

  //Getting the positions after velocities
  var A2 = A1.pos.clone().add(A1.vel.clone().scale(time));
  var B2 = B1.pos.clone().add(B1.vel.clone().scale(time));
  //Getting the midpoint between the points after velocities
  var M2 = A2.clone().mid(B2);
  //Getting the "angle" after vels
  var Ang2 = A2.clone().sub(B2);
  //Getting the distance after vels
  var D2 = A2.dist(B2);


  //Linear Velocity is the difference between the midpoints
  var linearvel = M2.clone().sub(M1);

  //Expanding Velocity is the velocity that is parrallel to the line
  //Rotational velocity is the velocity that is perpendicular to the line

  var A1_er_Vel = A1.vel.clone().sub(linearvel);
  var B1_er_Vel = B1.vel.clone().sub(linearvel);



  //expansion velocity is the difference between the distances
  var expandvel = 0;
  //Use law of cosigns to find the angular velocity?
  var rotatevel = 0;

  if(Math.abs(Ang1.angle() - Ang2.angle()) > 0.0001){
    //we only worry about rotational vels if the slopes are different
    //If it was real rotational velocity, this would not fly
    //The Angle we're looking for is opposite of the distance between the new point and old
    //The radius is the other two lengths
    //I am aware this is not correct
    rotatevel = Math.acos(1 - Math.pow(A2.dist(A1),2) / (Math.pow(D2,2)/2));
  }
  if(rotatevel === 0){
    if(Math.abs(D2 - D1) > 0.000001){
      //Normalized in resp00ect to A and M
      //expansion velocity is the difference between the distances
      expandvel = A1.pos.clone().sub(M1).div(D1).abs().mul(D2-D1);
    }
    //We don't need to worry about Expansive velocities if no change in rotation and distance
  }else{
    console.log("we have an angle?");
    //technically expansive velocities are higly dependent on rotational
    //But in reality, if there is a "rotational" vel
    //there will be a expansive vel since "rotational" vel's actually cut through
    //The radius because all velocities are linear
  }


  return {
    cache:{
      before:{a:A1,b:B1,m:M1,ang:Ang1,d:D1},
      after:{a:A2,b:B2,m:M2,ang:Ang2,d:D2}
    },
    linearvel: linearvel,
    expandvel: expandvel,
    rotatevel: rotatevel
  };
}

/*
  net_vel.x*distance = parrallel_magnitude*net_slope.x +
                    -1*perpendicular_magnitude*net_slope.y

  net_vel.y*distance = parrallel_magnitude*net_slope.y +
                    + perpendicular_magnitude*net_slope.x
*/
function getParallelVelocity(net_vel,net_slope){
  var dist = net_slope.length();
  //  var per = (net_slope.x*par - net_vel.x*dist)/net_slope.y;
  //  var par*net_slope.y = net_vel.y*dist - net_slope.x*per
  //  var par*net_slope.y = net_vel.y*dist - net_slope.x*(net_slope.x*par - net_vel.x*dist)/net_slope.y
  //  var par*net_slope.y = net_vel.y*dist - net_slope.x/net_slope.y*(net_slope.x*par - net_vel.x*dist)
  //  var par*net_slope.y = net_vel.y*dist - net_slope.x/net_slope.y*net_slope.x*par + net_slope.x/net_slope.y*net_vel.x*dist
  //  var par*net_slope.y + net_slope.x/net_slope.y*net_slope.x*par = net_vel.y*dist + net_slope.x/net_slope.y*net_vel.x*dist
  //  var par(net_slope.y + net_slope.x*net_slope.x/net_slope.y) = net_vel.y*dist + net_slope.x/net_slope.y*net_vel.x*dist
  //  var par(net_slope.y + net_slope.x*net_slope.x/net_slope.y) = net_vel.y*dist + net_vel.x*dist*net_slope.x/net_slope.y
  //  var par(net_slope.y + net_slope.x*net_slope.x/net_slope.y) = dist*(net_vel.y + net_vel.x*net_slope.x/net_slope.y)
  //  var par = dist*(net_vel.y + net_vel.x*net_slope.x/net_slope.y)/(net_slope.y + net_slope.x*net_slope.x/net_slope.y)
  //  var par = dist*net_slop.y(net_vel.y + net_vel.x*net_slope.x/net_slope.y)/(net_slope.y*net_slope.y + net_slope.y*net_slope.x*net_slope.x/net_slope.y)
  //  var par = dist*(net_vel.y*net_slop.y + net_vel.x*net_slope.x)/(net_slope.y*net_slope.y + net_slope.x*net_slope.x)
  //  var par = dist*(net_vel.y*net_slop.y + net_vel.x*net_slope.x)/(net_slope.y^2 + net_slope.x^2)

}

/*
net_vel.x*distance = parrallel_magnitude*net_slope.x +
                  -1*perpendicular_magnitude*net_slope.y

net_vel.y*distance = parrallel_magnitude*net_slope.y +
                  + perpendicular_magnitude*net_slope.x
*/

function getPerpendicularVelocity(net_vel,net_slope){
  var dist = net_slope.length();
//  var par = (net_vel.x*dist + net_slope.y*per)/net_slope.x;
//  var net_slope.x*per = net_vel.y*dist - net_slope.y*par;
//  var net_slope.x*per = net_vel.y*dist - net_slope.y*(net_vel.x*dist + net_slope.y*per)/net_slope.x;
//  var net_slope.x*per = net_vel.y*dist - net_slope.y/net_slope.x*(net_vel.x*dist + net_slope.y*per);
//  var net_slope.x*per = net_vel.y*dist - net_vel.x*dist*net_slope.y/net_slope.x - net_slope.y*per*net_slope.y/net_slope.x;
//  var net_slope.x*per + net_slope.y*per*net_slope.y/net_slope.x = net_vel.y*dist - net_vel.x*dist*net_slope.y/net_slope.x;
//  var per*(net_slope.x + net_slope.y*net_slope.y/net_slope.x) = net_vel.y*dist - net_vel.x*dist*net_slope.y/net_slope.x;
//  var per*net_slope.x*(net_slope.x + net_slope.y*net_slope.y/net_slope.x) = net_vel.y*dist*net_slope.x - net_vel.x*dist*net_slope.y;
//  var per*(net_slope.x*net_slope.x + net_slope.y*net_slope.y) = net_vel.y*dist*net_slope.x - net_vel.x*dist*net_slope.y;
//  var per = (net_vel.y*dist*net_slope.x - net_vel.x*dist*net_slope.y)/(net_slope.x*net_slope.x + net_slope.y*net_slope.y);
//  var per = dist*(net_vel.y*net_slope.x - net_vel.x*net_slope.y)/(net_slope.x^2 + net_slope.y^2);

}


function getNetVelocityAtPoint(P1,vels){
  var M1 = vels.cache.before.m;
  var PD1 = P1.dist(M1);
  var D1 = vels.cache.before.d;
  var vel = vels.linearvel.clone();
  if(vels.rotatevel === 0){
    if(vels.expandvel === 0) return vel;
    return vel.add(vels.expandvel.mul(P1.clone().sub(M1).signum())*PD1*2/D1);
  }
}

function getVelocityAtPoint(A,B,P){
  var ad = A.pos.dist(P.pos);
  var bd = B.pos.dist(P.pos);
  return A.vel.clone().mul(bd).div(ad+bd).add(B.vel.clone().mul(ad).div(ad+bd));
}

function getVelocitiesFromPoint(A,B,P){
  var ad = A.pos.dist(P.pos);
  var bd = B.pos.dist(P.pos);
  var nd = ad+bd;
  //
//  A = (ad+bd)*(P - B.vel.clone().mul(ad).div(ad+bd))/bd;
//  B = (ad+bd)*(P - A.vel.clone().mul(bd).div(ad+bd))/ad;

  A.vel.mul(ad).div(nd).add(P.vel.mul(bd).div(nd));
  B.vel.mul(bd).div(nd).add(P.vel.mul(ad).div(nd));
}


module.exports.getVelocityAtPoint = getVelocityAtPoint;
module.exports.getVelocitiesFromPoint = getVelocitiesFromPoint;
module.exports.getNetVelocityAtPoint = getNetVelocityAtPoint;
module.exports.getVelocities = getVelocities;

/*
  We have the angle of the Line between point A and B
  we must then understand how much of the velocity at point A is
    -perpendicular
    -parrallel

  Parrellel line's definition assumes
    -The angle between the two lines are 0 or 180
    -the slope of the lines are equal
    -the vector's of the line can be
      - (-x, -slope*x) or (x, slope*x)
      - (-y/slope, -y) or (y/slope, y)

  Perpendicular line's definition assumes
    -The angle between the two lines are 90 or 270
    -The slope of the lines are -1*(x/y)
    -The vector's of the line can be
      - (-slope*x, -x) or (slope*x, x)
      - (-y, -y/slope) or (y, y/slope)

  f(net_vel) = parrallel_magnitude*normal_slope + perpendicular_magnitude*normal_slope

  normal_slope = net_slope/distance

  f(net_vel)  = parrallel_magnitude*net_slope/distance
              + perpendicular_magnitude*net_slope_swapped/distance

  net_vel = parrallel_magnitude*net_slope/distance
          + perpendicular_magnitude*net_slope_swapped/distance

  net_vel*distance = parrallel_magnitude*net_slope
                    + perpendicular_magnitude*-1*net_slope_swapped


  net_vel.x*distance = parrallel_magnitude*net_slope.x +
                    + perpendicular_magnitude*-1*net_slope.y

  net_vel.y*distance = parrallel_magnitude*net_slope.y +
                    + perpendicular_magnitude*net_slope.x

  perpendicular_magnitude = (net_vel.y*distance - parrallel_magnitude*net_slope.y)/net_slope.x

  net_vel.x*distance  =
    parrallel_magnitude*net_slope.x -
    net_slope.y*(net_vel.y*distance - parrallel_magnitude*net_slope.y)/net_slope.x

  net_vel.x*distance  =
    parrallel_magnitude*net_slope.x -
    net_slope.y/net_slope.x*(net_vel.y*distance - parrallel_magnitude*net_slope.y)

  net_vel.x*distance  =
    parrallel_magnitude*net_slope.x -
    net_slope.y/net_slope.x*net_vel.y*distance
    + net_slope.y/net_slope.x*parrallel_magnitude*net_slope.y

    net_vel.x*distance + net_slope.y/net_slope.x*net_vel.y*distance
  =
    parrallel_magnitude(net_slope.x + net_slope.y*net_slope.y/net_slope.x)

    parrallel_magnitude
  =
    net_vel.x*distance + net_slope.y/net_slope.x*net_vel.y*distance
    /(net_slope.x - + net_slope.y*net_slope.y/net_slope.x)


  parrallel_magnitude = (net_vel.y*distance - perpendicular_magnitude*net_slope.x)
  /net_slope.y

  net_vel.x*distance = (net_vel.y*distance - perpendicular_magnitude*net_slope.x)
                    /net_slope.y
                    + perpendicular_magnitude*-1*net_slope.y

  net_vel.x*distance =
    net_vel.y*distance/net_slope.y
    - perpendicular_magnitude*net_slope.x/net_slope.y
    + perpendicular_magnitude*-1*net_slope.y

  net_vel.x*distance - net_vel.y*distance/net_slope.y =
  -1*(net_slope.x/net_slope.y + net_slope.y)
  * perpendicular_magnitude

  perpendicular_magnitude =
    (net_vel.x*distance - net_vel.y*distance/net_slope.y)
    / -1*(net_slope.x/net_slope.y + net_slope.y)

  perpendicular_magnitude =
    distance*(net_vel.x - net_vel.y/net_slope.y)
    / (-1*(net_slope.x/net_slope.y + net_slope.y))


  perpendicular_magnitude =
    distance*(net_vel.x - net_vel.y/net_slope.y)
    / (-1*(net_slope.x/net_slope.y + net_slope.y))


  parrallel_magnitude =
    (
      net_vel.y*distance -
      (
        distance*(net_vel.x - net_vel.y/net_slope.y)
        / (-1*(net_slope.x/net_slope.y + net_slope.y))
      )*net_slope.x
    )/net_slope.y

  parrallel_magnitude =
    distance*(
      net_vel.y -
      (
        (net_vel.x - net_vel.y/net_slope.y)
        / (-1*(net_slope.x/net_slope.y + net_slope.y))
      )*net_slope.x
    )/net_slope.y



*/
