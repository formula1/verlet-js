/*
I'd like to cache calculations dependent on timestep
-This is especially important for things like delaunay
*/


function TimeStepDependent(){
  this.fresh = 0;
  this.refresh = {};
  this.isfresh = {};
}

TimeStepDependent.prototype.refresh = function(TimeStep){
  this.fresh = TimeStep || Date.now();
}

TimeStepDependent.prototype.depValue = function(name, fn){
  var val;
  var freshness =-1;
  Object.defineProperty(this,name,{
    get:function(){
      if(this.fresh != freshness){
        freshness = this.fresh;
        val = fn();
      }
      return val;
    }.bind(this);
  })
  this.refresh[name] = function(){
    freshness = this.fresh;
  }
  this.isfresh[name] = function(){
    return this.fresh != freshness;
  }
}
