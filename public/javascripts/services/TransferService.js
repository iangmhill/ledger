// public/javascripts/services/TransferService.js
app.service('TransferService', function($http, $q) {

  /*
   * Get pending transfers by org id
   */
  this.getPendingTransfers = function(id) {
    var deferred = $q.defer();
    $http.get('/api/getPendingTransfers/' + id).then(function (response) {
      return deferred.resolve(response.data);
    });
    return deferred.promise;
  };

});