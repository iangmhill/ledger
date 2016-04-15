// public/javascripts/controllers/RecordController.js
app.controller('RecordController', function($scope, RecordService) {
	
  var RecCtrl = this;

  $scope.reim = {
    value: '',
      validation: {
        // isValid: 'valid',
        isValid: 'empty',
        helpBlock: ''
      },
    validate: function(){
      if($scope.recordForm.reim.$valid){
        this.validation.isValid = "valid";
      }
      else{
        this.validation.isValid = "invalid";
        if($scope.recordForm.reim.$error.required){
          this.validation.helpBlock = "This field cannot be empty";
        }
        else{
          this.validation.helpBlock = "This field must be string";
        }
      }
    } 
  }


  $scope.type = {
    value: '',
      validation: {
        // isValid: 'valid',
        isValid: 'empty',
        helpBlock: ''
      },
    validate: function(){
      if($scope.recordForm.type.$valid){
        this.validation.isValid = "valid";
      }
      else{
        this.validation.isValid = "invalid";
        if($scope.recordForm.type.$error.required){
          this.validation.helpBlock = "This field cannot be empty";
        }
        else{
          this.validation.helpBlock = "This field must be string";
        }
      }
    } 
  }

  $scope.org = {
    value: '',
      validation: {
        // isValid: 'valid',
        isValid: 'empty',
        helpBlock: ''
      },
    validate: function(){
      if($scope.recordForm.org.$valid){
        this.validation.isValid = "valid";
      }
      else{
        this.validation.isValid = "invalid";
        if($scope.recordForm.org.$error.required){
          this.validation.helpBlock = "This field cannot be empty";
        }
        else{
          this.validation.helpBlock = "This field must be string";
        }
      }
    } 
  }

  $scope.pcard = {
    value: '',
      validation: {
        // isValid: 'valid',
        isValid: 'empty',
        helpBlock: ''
      },
    validate: function(){
      if($scope.recordForm.pcard.$valid){
        this.validation.isValid = "valid";
      }
      else{
        this.validation.isValid = "invalid";
        if($scope.recordForm.pcard.$error.required){
          this.validation.helpBlock = "This field cannot be empty";
        }
        else{
          this.validation.helpBlock = "This field must be string";
        }
      }
    } 
  }


  $scope.price = {
    value: 0,
      validation: {
        isValid: 'empty',
        helpBlock: ''
      },
    validate: function(){
      if($scope.recordForm.price.$valid && this.value > 0){
        this.validation.isValid = "valid";
      }
      else{
        this.validation.isValid = "invalid";
        if($scope.recordForm.price.$error.required){
          this.validation.helpBlock = "This field cannot be empty";
        }
        else{
          this.validation.helpBlock = "The amount must be larger than zero";
        }
      }
    } 
  }

  $scope.sac = {
    value: '',
      validation: {
        // isValid: 'valid',
        isValid: 'empty',
        helpBlock: ''
      },
    validate: function(){
      if($scope.recordForm.sac.$valid){
        this.validation.isValid = "valid";
      }
      else{
        this.validation.isValid = "invalid";
        if($scope.recordForm.sac.$error.required){
          this.validation.helpBlock = "This field cannot be empty";
        }
        else{
          this.validation.helpBlock = "This field must be string";
        }
      }
    } 
  }

  $scope.date = {
    value: '',
      validation: {
        // isValid: 'valid',
        isValid: 'empty',
        helpBlock: ''
      },
    validate: function(){
      if($scope.recordForm.date.$valid){
        this.validation.isValid = "valid";
        console.log("got through");
      }
      else{
        this.validation.isValid = "invalid";
        if($scope.recordForm.date.$error.required){
          console.log("no input");
          this.validation.helpBlock = "This field cannot be empty";
        }
        else if ($scope.recordForm.date.$error.pattern){
          console.log("wrong pattern");
          this.validation.helpBlock = "Please enter a valid date in the format MM/DD/YYYY";
        }
      }
    } 
  }

  this.clear = function(field) {
    field.value = '';
    field.validation.isValid = 'empty';
    field.validation.helpBlock = '';
  };


	this.submitCreateRecordForm = function() {

    $scope.reim.validate();
    $scope.type.validate();
    $scope.org.validate();
    $scope.pcard.validate();
    $scope.price.validate();
    $scope.sac.validate();

    var data = {
      type: $scope.type.value,
      occurred: new Date($scope.date.value),
      paymentMethod: $scope.pcard.value,
      request: "testrequest",
      value: $scope.price.value,
      details: "test",
      org: $scope.org.value,
      void: false
    }
    console.log(data);
    RecordService.createRecord(data);
      
    this.clear($scope.org);
    this.clear($scope.type);
    this.clear($scope.pcard);
    this.clear($scope.price);
    this.clear($scope.reim);
    this.clear($scope.date);
    this.clear($scope.sac);
  
	};  

});


