var defer = require('../');
var promise = defer(function(){
	var self = this;
	setTimeout(function(){
		self.resolve("Hello world!");
	}, 100);
})
promise.then(function(data){
	//on success function
}).catch(function(err){
	console.log(err);
}).finally(function(err, data){
	console.log(err, data);
});