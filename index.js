var Deferred = function(initFunc){
  var doneCbs = [];
  var failCbs = [];
  var isFailed = false;
  var isDone = false;
  var result_args = [];

  typeof initFunc === 'function' && initFunc.call(this);

  this.isRejected = function(){
    return isFailed;
  };

  this.promise = function(){
    return this;
  };

  this.reject = function(){
    if(isDone || isFailed) return this;
    isFailed = true;
    result_args = arguments;
    while(failCbs.length > 0) {
      var cb = failCbs.shift();
      cb && cb.apply(this, result_args);
    }
    return this;
  };

  this.resolve = function(){
    if(isDone || isFailed) return this;
    isDone = true;
    result_args = arguments;
    while(doneCbs.length > 0) {
      var cb = doneCbs.shift();
      cb && cb.apply(this, result_args);
    }
    return this;
  };

  this.success = this.done = function(cb){
    typeof cb === 'function' || (cb = function(){});
    if(isDone) {
      cb.call(this, result_args);
      return this;
    }
    doneCbs.push(cb);
    return this;
  };

  this.error = this.fail = function(cb){
    typeof cb === 'function' || (cb = function(){});
    if(isFailed) {
      cb.call(this, result_args);
      return this;
    }
    failCbs.push(cb);
    return this;
  };

  this.then = function(doneCb, failCb){
    typeof doneCb === 'function' || (doneCb = function(){});
    typeof failCb === 'function' || (failCb = function(){});
    if(isDone) {
      doneCb.apply(this, result_args);
      return this;
    }
    if(isFailed) {
      failCb.apply(this, result_args);
      return this;
    }
    doneCbs.push(doneCb);
    failCbs.push(failCb);
    return this;
  };

  return this;
};

Deferred.when = function(){
  var args = arguments;
  var defer = new Deferred();
  var length = args.length;
  var isRejected = false;
  var agrigated_results = [];

  setTimeout(function(){
    for(i in args) {
      if(isRejected) {
          break;
      }
      if(args[i] && typeof args[i].promise === 'function') {
        args[i].then(function(){
          length--;
          agrigated_results.push(arguments);
          if(!isRejected && length === 0) {
            defer.resolve.apply(defer, agrigated_results);
          }
        },function(){
          isRejected = true;
          defer.reject.apply(defer, arguments);
        });
      } else {
        length--;
        if(length === 0) {
          defer.reject(['Not a promise']);
        }
      }
    }
  },0);

  return defer.promise();
};

module.exports = Deferred;
