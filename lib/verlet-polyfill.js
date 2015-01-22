if(!Math.sign){
  Math.sign = function(x){
    if( +x === x ) { // check if a number was given
      return (x === 0) ? x : (x > 0) ? 1 : -1;
    }
    return NaN;
  }
}

if(!Math.quadratic){
  //x = (-b +- b*b - 4ac )/(2a)
  Math.quadratic = function(a,b,c){
    var ret = b*b - 4*a*c;
    if(ret < 0) return false;
    if(ret == 0) return [-b/(2*a)];
    a *= 2;
    ret = Math.sqrt(ret)/a;
    b *= -1/a
    return [b + ret, b - ret];
  }
}

if(!Math.lawCos){
  //x = (-b +- b*b - 4ac )/(2a)
  Math.lawCos = function(a,b,c){
    return Math.acos(
      (-a*a + b*b + c*c)/
      (2*b*c)
    );
  }
}
