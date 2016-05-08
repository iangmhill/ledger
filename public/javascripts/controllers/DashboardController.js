// public/javascripts/controllers/DashboardController.js
app.controller('DashboardController', function($scope, RequestService, AuthService) {
	console.log(new Date());
  var DashCtrl = this;

	this.requestsHistory= {
		isCollapsed: true
	};

	RequestService.getRequests(AuthService.currentUser._id).then(function(requests) {
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
      if (success) {
        console.log("Modification Success"); // do you really need to log this?
      } else {
        alert("Modification Failure"); // Is an alert the right choice? I think you guys mostly use in-page error/validation messages... be consistent?
      }
    });
  };

  this.cancel = function(index, ans){
    var targetRequest = DashCtrl.requests.splice(index, 1);
    targetRequest = targetRequest[0]
    targetRequest.isDecided = true;
    targetRequest.isActive = false;

    RequestService.editRequest(targetRequest).then(function(success){
      if (success) {
        console.log("Modification Success");
      } else {
        alert("Modification Failure");
      }
    })
  };

});
