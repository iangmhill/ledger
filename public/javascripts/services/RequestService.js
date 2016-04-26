// public/javascripts/services/OrgService.js

app.service('RequestService', function($http, $q, $location) {
  this.reEditRequest = false;
  this.reEditRequestInfo;

  this.createRequest = function(requestData) {
  	var deferred = $q.defer();
    $http.post('/api/createRequest', requestData).then(function success(response) {
    	if (response.data.isSuccessful == true){
	    	deferred.resolve(response.data.isSuccessful);
    	} else {
	    	deferred.reject(response.data.isSuccessful);
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

// funciton for redirecting url
  this.go = function ( path ) {
    $location.path( path );
  };

});