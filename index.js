/**
 * Deferred object
 * Simple class to make promises
 * @param function initFunc optional argument if you want to init something on call
 * @returns {Deferred}
 */
var Deferred = function deferred (initFunc) {
  var doneCbs = [];
  var failCbs = [];
  var isFailed = false;
  var isDone = false;
  var result_args = [];

  this.isDone = this.isCompleted = function () {
    return isDone;
  };

  this.isRejected = function () {
    return isDone && isFailed;
  };

  this.promise = function () {
    return this;
  };

  this.reject = function () {
    if (isDone || isFailed)
      return this;
    isFailed = true;
    result_args = arguments;
    while (failCbs.length > 0) {
      var cb = failCbs.shift();
      cb && cb.apply(this, result_args);
    }
    return this;
  };

  this.resolve = function () {
    if (isDone || isFailed)
      return this;
    isDone = true;
    result_args = arguments;
    while (doneCbs.length > 0) {
      var cb = doneCbs.shift();
      cb && cb.apply(this, result_args);
    }
    return this;
  };

  this.success = this.done = function (cb) {
    typeof cb === 'function' || (cb = function () {
    });
    if (isDone) {
      cb.call(this, result_args);
      return this;
    }
    doneCbs.push(cb);
    return this;
  };

  this.error = this.fail = this.catch = function (cb) {
    typeof cb === 'function' || (cb = function () {
    });
    if (isFailed) {
      cb.call(this, result_args);
      return this;
    }
    failCbs.push(cb);
    return this;
  };

  this.then = function (doneCb, failCb) {
    typeof doneCb === 'function' || (doneCb = function () {
    });
    typeof failCb === 'function' || (failCb = false);
    if (isDone) {
      doneCb.apply(this, result_args);
      return this;
    }
    if (isFailed && failCb) {
      failCb.apply(this, result_args);
      return this;
    }
    doneCbs.push(doneCb);
    failCb && failCbs.push(failCb);
    return this;
  };
	
	this.complete = this.finally = function(cb){
		if(isDone) {
			cb.bind(this, null).apply(this, result_args);
			return this;
		}
		if(isFailed) {
			cb.apply(this, result_args);
			return this;
		}
		doneCbs.push(cb.bind(this, null));
		failCbs.push(cb);
		return this;
	};

	if('function' === typeof this) {
		return new Deferred(initFunc);
	}
	
  typeof initFunc === 'function' && initFunc.call(this);

  return this;
};
/**
 * Convinient stack array for when.push(promise) logic
 * @type Array
 */
Deferred.stack = [];

/**
 * Wait when all promises done .then...
 * @returns {deferred}
 */
Deferred.when = function () {
  var args = Array.prototype.slice.call(arguments).concat(Deferred.stack);
  var defer = new Deferred();
  var length = args.length;
  var isRejected = false;
  var aggregated_results = [];

  //clear stack on call
  Deferred.stack = [];

  setTimeout(function () {
    for (var i in args) {
      if (isRejected) {
        break;
      }
      if (args[i] && typeof args[i].promise === 'function') {
        args[i].then(function () {
          length--;
          aggregated_results.push(arguments);
          if (!isRejected && length === 0) {
            defer.resolve.apply(defer, aggregated_results);
          }
        }, function () {
          isRejected = true;
          defer.reject.apply(defer, arguments);
        });
      } else {
        length--;
        if (length === 0) {
          defer.reject(['Not a promise']);
        }
      }
    }
  }, 0);

  return defer.promise();
};

/**
 * Chainable promises stack aggregator
 * @param {Deferred} promise
 * @returns {Deferred.when}
 */
Deferred.when.push = function (promise) {
  if(promise instanceof Array) {
    Deferred.stack.push.apply(Deferred.stack, promise);
  } else {
    Deferred.stack.push(promise);
  }
  return Deferred.when;
};

module.exports = Deferred;
