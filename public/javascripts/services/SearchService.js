// public/javascripts/services/SearchService.js
app.service('SearchService', function($http, $q) {

  	this.getRequests = function(orgValue){
  		console.log("org value:" + orgValue);
  		var deferred = $q.defer();
  		$http.get('/api/getOrgRequests/' + orgValue).then(function (response) {
	      console.log(response.data);
	      return deferred.resolve(response.data);
    	});
    	return deferred.promise;
  	};


  	this.getRecords = function(orgValue){
  		console.log("org value:" + orgValue);
  		var deferred = $q.defer();
  		$http.get('/api/getOrgRecords/' + orgValue).then(function (response) {
	      console.log(response.data);
	      return deferred.resolve(response.data);
    	});
    	return deferred.promise;
  	};

});