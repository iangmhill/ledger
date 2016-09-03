// public/javascripts/controllers/DashboardController.js
app.controller('DashboardController', function($scope, RequestService, AuthService) {
  console.log(new Date());
  var DashCtrl = this;

  console.log("AuthService.currentUser");
  console.log(AuthService.currentUser);
  RequestService.getRequests().then(function(requests) {
    console.log("requests");
    console.log(requests);
    DashCtrl.requests = requests;
  });

  this.resubmit = function(index, ans){
    RequestService.go("/request");

    var targetRequest = DashCtrl.requests.splice(index, 1);

    targetRequest = targetRequest[0]
    DashCtrl.requests.push(targetRequest);

    RequestService.reEditRequest = true;
    RequestService.reEditRequestInfo = targetRequest;

    targetRequest.isDecided = false;
    targetRequest.isApproved = false;


    RequestService.editRequest(targetRequest).then(function(success){
      if(success){
        console.log("Modification Success");

      }else{
        alert("Modification Failure");
      }
    })

  };

  this.cancel = function(index, ans){
    var targetRequest = DashCtrl.requests.splice(index, 1);
    targetRequest = targetRequest[0]
    targetRequest.isDecided = true;
    targetRequest.isActive = false;

    console.log("targetRequest");
    console.log(targetRequest);
    RequestService.editRequest(targetRequest).then(function(success){
      if(success){
        console.log("Modification Success");
      }else{
        alert("Modification Failure");
      }
    })
  };

});