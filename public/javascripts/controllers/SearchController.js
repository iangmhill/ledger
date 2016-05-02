// public/javascripts/controllers/SearchController.js
app.controller('SearchController', function($scope, AllocationService, OrgService, SearchService) {

  OrgService.getUserOrgs().then(function(data) {
    if (data){
      $scope.orgs = data.orgs;
    }
  });

  $scope.req = true;
  $scope.rec = true;

  $scope.rowCollection = [];
  $scope.displayed = [];


  $scope.submitSearch =function(){
    if ($scope.type.value == "request"){
      $scope.req = false;
      $scope.rec = true;
      SearchService.getRequests($scope.org.value).then(function(response) {
        $scope.rowCollection = response;
      });
    }
    else if($scope.type.value == "record"){
      $scope.rec = false;
      $scope.req = true;
      SearchService.getRecords($scope.org.value).then(function(response) {
        $scope.rowCollection = response;
      });
    }
  };

});