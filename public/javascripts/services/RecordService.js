// public/javascripts/services/RecordService.js
app.service('RecordService', function($http, $q) {

    this.createRecord = function(recordData) {
      var deferred = $q.defer();
      $http.post('/api/createRecord', recordData).then(function (response) {
        return deferred.resolve(response.data.isSuccessful);
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