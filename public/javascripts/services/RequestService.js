// public/javascripts/services/OrgService.js

app.service('RequestService', function($http, $q, $location) {
  this.reEditRequest = false;
  this.reEditRequestInfo;

  this.createRequest = function(request) {
  	var deferred = $q.defer();
    $http.post('/api/createRequest', request).then(function success(response) {
	    deferred.resolve(response.data.isSuccessful);
    });
    return deferred.promise;
  };

  this.editRequest = function(requestData) {
    var deferred = $q.defer();
    $http.post('/api/editRequest', requestData).then(function success(response) {
      if (response.data.success == true){
        deferred.resolve(response.data.success);
      } else { // usually you all style your elses like this, I think -- consistency throughout, please :)
        deferred.reject(response.data.success);
      }
    }); // match indentation
    return deferred.promise;
  };

  this.getRequests = function(requestData) {
    var deferred = $q.defer();

    $http.get('/api/getRequests/' + requestData).then(function success(response) {
      if (response.data.success == true){
        deferred.resolve(response.data.requests);
      }
      else{
        deferred.reject(response.data.success);
      }
    });
    return deferred.promise;
  };

  this.getOrgRequests = function(orgValue){
    console.log("org value:" + orgValue);
    var deferred = $q.defer();
    $http.get('/api/getOrgRequests/' + orgValue).then(function (response) {
      console.log(response.data);
      return deferred.resolve(response.data);
    });
    return deferred.promise;
  };
  // funciton for redirecting url
  this.go = function ( path ) {
    $location.path( path );
  };

});

// comments about consistency, removing console.logs etc. apply throughout code -- I'm catching some of them, but not all
