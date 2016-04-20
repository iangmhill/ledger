// public/javascripts/services/OrgService.js
app.service('OrgService', function($http, $q) {

  this.getUserOrgs = function() {
    var deferred = $q.defer();
    $http.get('/api/getUserOrgs').then(function (response) {
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
      return deferred.resolve(response.data);
    });
    return deferred.promise;
  };
  /*
   * Change org ownership
   */
  this.addOwner = function(username, orgId) {
    return this.changeOwner(username, orgId, true);
  };

  this.removeOwner = function(username, orgId) {
    return this.changeOwner(username, orgId, false);
  };
  this.changeOwner = function(username, orgId, action) {
    var deferred = $q.defer();
    $http.post('/api/changeOwner', {
      username: username,
      orgId: orgId,
      action: action
    }).then(function (response) {
      return deferred.resolve(response.data);
    });
    return deferred.promise;
  };

  /*
   * Get an org by url
   */
  this.getOrgByUrl = function(url) {
    var deferred = $q.defer();
    $http.get('/api/getOrgByUrl/' + url).then(function (response) {
      return deferred.resolve(response.data);
    });
    return deferred.promise;
  };
  /*
   * Create and approve transfer requests
   */
  this.createTransfer = function(org, to, from, value, justification) {
    var deferred = $q.defer();
    $http.post('/api/createTransfer', {
      org: org,
      to: to,
      from: from,
      value: value,
      justification: justification
    }).then(function (response) {
      return deferred.resolve(response.data);
    });
    return deferred.promise;
  };

});