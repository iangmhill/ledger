// public/javascripts/services/OrgService.js
app.service('OrgService', function($http, $q) {

  this.getUserOrgs = function() {
    var deferred = $q.defer();
    $http.get('/api/getUserOrgs').then(function (response) {
      console.log(response.data);
      return deferred.resolve(response.data);
    });
    return deferred.promise;
  };

  this.createOrg = function(orgData) {
    var deferred = $q.defer();
    $http.post('/api/createOrg', orgData).then(function (response) {
      return deferred.resolve(response.data);
    });
    return deferred.promise;
  };

  this.getOrgList = function() {
    var deferred = $q.defer();
    $http.get('/api/getListedOrgs').then(function (response) {
      console.log("response.data: " + response.data);
      return deferred.resolve(response.data);
    });
    return deferred.promise;
  };

});