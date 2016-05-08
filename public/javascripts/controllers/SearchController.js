// public/javascripts/controllers/SearchController.js
app.controller('SearchController', function($scope, OrgService,
    RequestService, RecordService) {

  OrgService.getUserOrgs().then(function(data) {
    if (data){
      $scope.orgs = data.orgs;
    }
  });

  $scope.req = true; // why not use full request/record instead of req/rec? Easier to read & maintain, in my opinion.
  $scope.rec = true;

  $scope.rowCollection = [];
  // $scope.displayed = [];


  $scope.submitSearch =function(){
    if ($scope.type.value == "request"){
      $scope.req = false;
      $scope.rec = true;
      RequestService.getOrgRequests($scope.org.value).then(function(response) {
        $scope.rowCollection = response;
      });
    }
    else if($scope.type.value == "record"){
      $scope.rec = false;
      $scope.req = true;
      RecordService.getRecords($scope.org.value).then(function(response) {
        $scope.rowCollection = response;
      });
    }
  };

});
