// public/javascripts/services/OrgService.js

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
  };

  this.editRequest = function(requestData) {
    var deferred = $q.defer();
    console.log("request Service: " + requestData);
    $http.post('/api/editRequest', requestData).then(function success(response) {
      console.log("response.data: " + response.data.success);
      if (response.data.success == true){
        deferred.resolve(response.data.success);    
      }
      else{
        deferred.reject(response.data.success);   
      }
      });
    return deferred.promise;
  };

  this.getRequests = function(requestData) {
    var deferred = $q.defer();
    console.log("request Service: ");
    console.log(requestData);
    
    $http.get('/api/getRequests' + requestData).then(function success(response) {
    console.log("response.data: " + response.data.success);
    console.log(response.data);
    if (response.data.success == true){
      deferred.resolve(response.data.requests);    
    }
    else{
      deferred.reject(response.data.success);   
    }
    });
  return deferred.promise;
  };


});