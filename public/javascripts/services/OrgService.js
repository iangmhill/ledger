// public/javascripts/services/OrgService.js
app.service('OrgService', function($http) {

  this.get = function() {
    var orgs = $http.get('/api/getOrgs').then(function (response) {
        return response.data;
      });
    return orgs;
  };

});