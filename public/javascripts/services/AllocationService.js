// public/javascripts/services/AllocationService.js
app.service('AllocationService', function($http, $q) {

  this.create = function(allocationData) {
    var confirmation = $q.defer();
    $http.post('/api/createAllocation', allocationData
    ).then(function (response) {
      if (response.data.success) {
        confirmation.resolve({
          success: response.data.success,
          date: response.data.date,
          org: response.data.org,
          value: '$' + response.data.value.toFixed(2),
          description: response.data.description
        });
      } else {
        confirmation.resolve({
          success: response.data.success,
          message: response.data.message
        });
      }

    }, function (error) {
      console.log('ERROR: Promise error in AllocationService', error);
      confirmation.reject(error);
    });
    return confirmation.promise;
  }
});