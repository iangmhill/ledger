// public/javascripts/controllers/RecordController.js
app.controller('RecordController', function($scope, RecordService) {
	var rec = this;
	var alertMessages = {
	SUBMIT_SUCCESSFUL:
	  ', your purchase has been recorded',
	INFO_INVALID:
	  'Please answer to all the questions'
	};

	this.submitCreateRecordForm = function() {
		var RegCtrl = this;

			// this.reimburse.value != 'n' &&
		//       this.typeChoice.value != 'n' &&
		//       this.org.value != 'n' &&
		//       this.pcard.value != 'n' &&
		//       rec.price.value > 0 &&
		//       rec.sac.value != 'n'
		this.typeChoiceValue = "testing"
		this.priceValue = 100
		this.pcardValue = 1
		this.dateValue = 04102016
		this.orgValue = "testing"
		user = "testVoiderUser"

		console.log("triggered");
		if (1)
		{
			console.log("right before sending at client");
			RecordService.saveRecord({
				type: this.typeChoiceValue,
				value: this.priceValue,
				paymentMethod: this.pcardValue,
				occured: this.dateValue,
				org: this.orgValue,
				user: "testUser",
				request: "testRequest",
				details: "for test",
				voider: user,
		  }
	  ).then(function(response) {
	      if (response.isSuccessful) {
	        rec.alert.msg = alertMessages.SUBMIT_SUCCESSFUL;
	      } 
	  })
	} 
	else{
	  rec.alert.msg = alertMessages.INFO_INVALID;
	}
	}
});


