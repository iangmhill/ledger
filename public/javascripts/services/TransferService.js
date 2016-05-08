// public/javascripts/services/TransferService.js
app.service('TransferService', function($http, $q) {
  /*
   * Generic POST method
   */
  this.post = function(route, data) {
    var deferred = $q.defer();
    $http.post(route, data).then(function (response) {
      return deferred.resolve(response.data);
    });
    return deferred.promise;
  };
  /*
   * Generic GET method
   */
  this.get = function(route) {
    var deferred = $q.defer();
    $http.get(route).then(function (response) {
      return deferred.resolve(response.data);
    });
    return deferred.promise;
  };
  /*
   * Create and approve transfer requests
   */
  this.createTransfer = function(org, to, from, value, justification) {
    return this.post('/api/createTransfer', {
      org: org,
      to: to,
      from: from,
      value: value,
      justification: justification
    });
  };
  /*
   * Get pending transfers by org id
   */
  this.getPendingTransfers = function(id) {
    return this.get('/api/getPendingTransfers/' + id);
  };
  /*
   * Approve, reject, or amend a transfer
   */
  this.decideTransfer = function(org, transfer, response, approvedValue,
      verdict) {
    return this.post('/api/decideTransfer', {
      org: org,
      transfer: transfer,
      response: response,
      approvedValue: approvedValue,
      verdict: verdict
    });
  };

});