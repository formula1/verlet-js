
var pitable = {};

for(var i = 0; i < 24 ; i++){
  var key = "pi_"+i+"_"+12;
  pitable[key] = Math.PI*i/12;
  pitable["neg_"+key] = Math.PI*2 - Math.PI*i/12;
}

module.exports = pitable;
