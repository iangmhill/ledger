// public/javascripts/services/OrgService.js
<<<<<<< HEAD
app.service('RequestService', function($http, $q) {
  this.createRequest = function(requestData) {
  	var deferred = $q.defer();
  	console.log("requestService: " + requestData);
    $http.post('/api/createRequest', requestData).then(function success(response) {
    	console.log("response.data: " + response.data.success);
    	if (response.data.success == true){
	    	deferred.resolve(response.data.success);		
    	}
    	else{
	    	deferred.reject(response.data.success);		
    	}
      });
    return deferred.promise;

>>>>>>> debugging
  };

});