// public/javascripts/controllers/DashboardController.js
app.controller('DashboardController', function($scope, RequestService, AuthService) {
	var DashCtrl = this;

	this.requestsHistory= {
		isCollapsed: true
	};


	console.log("AuthService.currentUser");
	console.log(AuthService.currentUser);
	RequestService.getRequests(AuthService.currentUser._id).then(function(requests) {
		console.log("requests");
		console.log(requests);
		DashCtrl.requests = requests;
	});

  this.resubmit = function(index, ans){
    var targetRequest = DashCtrl.requests.splice(index, 1);
    // var newRequest = JSON.parse(JSON.stringify(targetRequest))
    targetRequest = targetRequest[0]
    targetRequest.inApproved = true;
	targetRequest.isApproved = false;
	DashCtrl.requests.push(targetRequest);
    // if(ans){
    //   targetRequest.isApproved = true;
    // }else{
      // targetRequest.isApproved = false;
    // }
    console.log("targetRequest");
    console.log(targetRequest);  
    RequestService.editRequest({request: targetRequest}).then(function(success){
      if(success){
        console.log("Modification Success");
      }else{
        alert("Modification Failure");
      }
    })
  };

});