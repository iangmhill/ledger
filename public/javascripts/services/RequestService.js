// public/javascripts/services/OrgService.js
app.service('RequestService', function($http) {
  this.createRequest = function(requestData) {
  	console.log("requestService: " + requestData);
    $http.post('/api/createRequest', requestData).then(function (response) {
    	console.log("response.data: " + response.data.success);
      });
  };

});