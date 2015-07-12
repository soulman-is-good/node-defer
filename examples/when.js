var Deferred = require('../');
var a = new Deferred();
var b = new Deferred();
var c = new Deferred();
Deferred.when.push(a.promise()).push([b,c])().then(
    function(args_a, args_b, args_c){
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
