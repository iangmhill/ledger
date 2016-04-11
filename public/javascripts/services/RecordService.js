// public/javascripts/services/RecordService.js
app.service('RecordService', function($http, $q, $rootScope, $location) {

	this.records = {}

	this.get = function() {
	var records = $http.get('/api/createRecord').then(function (response) {
	    return response.data;
	  });
	return records;
	};

  this.UpdateCallbacks = [];

  this.UpdateCallback = function(callback) {
    var service = this;
    this.UpdateCallbacks.push(callback);
      this.fetchPermissions().then(function success(response) {
        service.user = response.data;
        callback(service.user);
      })
  };
});