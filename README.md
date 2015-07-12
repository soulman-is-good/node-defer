node-defer
==========

Deferred object with when implementation

## Simple usage

```javascript
var defer = require('node-defer');
var promise = defer(function(){
	setTimeout(function(){
		this.resolve("Hello world!");
	}, 100);
})
promise.then(function(data){
	//on success
}).catch(function(err){
	console.log(err);
}).finally(function(err, data){
	console.log(err, data);
});
```

Here is another example:

```javascript
var Deferred = require('node-defer');
var a = new Deferred();
var b = new Deferred();
var c = new Deferred();
Deferred.when.push(a.promise()).push([b,c])().then(
    function(args_a, args_b, args_c) {
        console.log("Success", args_a, args_b, args_c);
    },
    function(err){
        console.log("Failure", err);
    }
);
//for async simulation
setTimeout(function(){
    a.resolve("A");
    b.reject(new Error("B"));
    c.resolve("C");
}, 1000);
```

## Deferred object methods

### *defer.resolve(arguments)*

Marks deferred instance as successfully resolved and calls all *success* callbacks.
Returns same deferred instance.

### *defer.reject(arguments)*

Marks deferred instance as failed and calls all *error* callbacks.
Returns same deferred instance.

### *defer.success(callback)*
### *defer.done(callback)*

Adds success callback on resolve.
Will be called immediately if resolve already fired.
Returns same deferred instance.

### *defer.error(callback)*
### *defer.fail(callback)*
### *defer.catch(callback)*

Adds error callback on reject.
Will be called immediately if reject already fired.
Returns same deferred instance.

### *defer.complete(callback)*
### *defer.finally(callback)*

Adds callback which will have 2 arguments: error and resolve arguments
Will be called immediately if reject already fired.
Returns same deferred instance.

### *defer.then(successCallback, errorCallback)*

Adds success and error callbacks respectively.
Will be called immediately if resolve or reject already fired.
Returns same deferred instance.

### *defer.isDone()*

Tells if instance already has been rejected or resolved.
Returns boolean.

### *defer.isRejected()*

Tells if instance has been rejected or not.
Returns boolean.

### *defer.promise()*

Returns same deferred instance.

## Deferred.when function

Aggregate promises stack resolve in one deferred instance