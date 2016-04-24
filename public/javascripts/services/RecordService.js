// public/javascripts/services/RecordService.js
app.service('RecordService', function($http, $q) {

    this.createRecord = function(recordData) {
	    console.log("recordService: " + recordData);
	    $http.post('/api/createRecord', recordData).then(function (response) {
        $http.post('api/recordemail', recordData);
	      console.log("response.data: " + response.data.success);
	      });
  	};


  	this.getRequests = function(){
  		var deferred = $q.defer();
  		console.log("got to getRequest");
  		$http.get('/api/getOrgRequests').then(function (response) {
	      console.log(response.data);
	      return deferred.resolve(response.data);
    	});
    	return deferred.promise;
  	};

});