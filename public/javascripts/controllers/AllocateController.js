// public/js/controllers/AllocateController.js
app.controller('AllocateController', function($scope, AllocationService, OrgService) {

  $scope.allocations = [];
  $scope.errors = [];


  OrgService.get().then(function(orgs) {
    $scope.orgs = orgs;
    console.log($scope.orgs);

  });
  
  $scope.submitCreateAllocationForm = function() {
    var confirmationPromise = AllocationService.create({
      description: $scope.description,
      value: $scope.value,
      org: $scope.org
    });
    confirmationPromise.then(
      function(confirmation) {
        if (confirmation.success) {
          $scope.allocations.unshift(confirmation);
          $scope.description = '';
          $scope.value = '';
          $scope.org = '';
        } else {
          $scope.errors.unshift(confirmation);
        }
      },
      function(error) {
        console.log('ERROR: Promise error in AllocateController', error);
      }
    );
    
  }

});