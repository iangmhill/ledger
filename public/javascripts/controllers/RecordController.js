// public/javascripts/controllers/RecordController.js
app.controller('RecordController', function($scope, RecordService, OrgService) {
	
  var RecCtrl = this;

  $scope.reqdata = {
    requests: null,
    availableOptions : null 
  };


  OrgService.getOrgList().then(function(data) {
    if (data){
      $scope.orgs = data;
      console.log(data);
    }
  });

  RecordService.getRequests().then(function(response) {
      $scope.reqs = response;
    });

  $scope.filterReq = function() {
      var request = $scope.reqs.filter(function (el) {
        return el.org == $scope.org.value
      });
      $scope.reqdata.availableOptions = request; 
  }

  $scope.names = [];

  $scope.updateTypeaheadOptions = function() {
    $scope.typeaheadOptions = {};
    for (var ele in $scope.orgs){
      elename = ele.name;
      $scope.typeaheadOptions[elename] = ele._id;
      $scope.names.push(elename);
    }
  };
  $scope.updateTypeaheadOptions();



  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function() {
    $scope.dt = null;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    maxDate: new Date(),
    minDate: new Date(2016, 1, 1),
    startingDay: 1
  };

  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }
    return '';
  }
  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.popup1 = {
    opened: false
  };




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



  $scope.items = [];
  $scope.links = [];
  var itemNum = 1;
  var linkNum = 1;
  var item = {
    name: "", 
    price: 0, 
    category: "", 
    index: 0,
      validation: {
        isValid: 'empty',
        nameHelpBlock: '',
        priceHelpBlock: '',
        categoryHelpBlock: ''
      }
  }
  $scope.items.push(item);
  $scope.specificationCheck = false;

    $scope.validateItem = function(index){
    $scope.items.forEach(function(item){
    // console.log("validation item");
      if (item.index == index) {
        console.log("find the item");
        console.log("index: " + index);
        console.log(item.name);
        item.validation.nameHelpBlock = "";
        item.validation.priceHelpBlock = "";
        item.validation.categoryHelpBlock = "";
        if(item.name == ""  || !item.name){
          item.validation.isValid = "invalid";
          item.validation.nameHelpBlock = "The name cannot be empty";
          console.log("name")
          console.log(item.validation.isValid);
          $scope.submitStatus -= 1; 
        }
        else{
          $scope.submitStatus += 1; 
          if(item.price == 0 || !item.price){
            item.validation.isValid = "invalid";          
            item.validation.priceHelpBlock = "The price must be a non-zero number";
            item.validation.categoryHelpBlock = "";             
            console.log("price")
            console.log(item.validation.isValid);
            $scope.submitStatus -= 1; 
          }
          else{
            $scope.submitStatus += 1; 
            if (item.category == ""  || !item.category){
              item.validation.isValid = "invalid";
              item.validation.categoryHelpBlock = "The category cannot be empty";             
              console.log("category")
              console.log(item.validation.isValid);
              $scope.submitStatus -= 1; 
            }
            else{
              $scope.submitStatus += 1; 
              item.validation.isValid = "valid";
              item.validation.nameHelpBlock = "";
              item.validation.priceHelpBlock = "";
              item.validation.categoryHelpBlock = "";
              console.log("else")
              console.log(item.validation.isValid);
            }
          }
        } 
      };
    })
  }


  $scope.addItem = function(){
    var newItem = {
      name: "", 
      price: 0, 
      category: "", 
      index: itemNum,
        validation: {
          isValid:  'empty',
          nameHelpBlock: '',
          priceHelpBlock: '',
          categoryHelpBlock: ''
        }
    }
    itemNum += 1;
    $scope.items.push(newItem);
  };
  $scope.delItem = function(index){
    $scope.items.splice(index, 1);
  };

  $scope.sum = function(items, prop){
      return items.reduce( function(a, b){
          return a + b[prop];
      }, 0);
  };

  $scope.totalamount = 0;

  $scope.updatePrice = function(){
    $scope.totalamount = $scope.sum($scope.items, 'price');
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
      }
      else{
        this.validation.isValid = "invalid";
        if($scope.recordForm.date.$error.required){
          this.validation.helpBlock = "This field cannot be empty";
        }
        else if ($scope.recordForm.date.$error.pattern){
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
    $scope.sac.validate();

    var data = {
      type: $scope.type.value,
      occurred: new Date($scope.date.value),
      paymentMethod: $scope.pcard.value,
      request: $scope.requests.value,
      value: $scope.totalamount,
      details: $scope.items,
      org: $scope.org.value,
      void: false
    }
    console.log(data);
    RecordService.createRecord(data);
    $scope.totalamount = 0;
    this.clear($scope.org);
    this.clear($scope.type);
    this.clear($scope.pcard);
    this.clear($scope.reim);
    this.clear($scope.date);
    this.clear($scope.sac);
    $scope.requests = "";
    

    itemNum = 1;
    $scope.items = $scope.items.splice(0, 1)
    $scope.items.forEach(function(item){
      item.name = "";
      item.price = 0;
      item.category = "";
      item.validation.isValid = "empty";
      item.validation.nameHelpBlock = "";
        item.validation.priceHelpBlock = "";
        item.validation.categoryHelpBlock = "";
    })
  
	};  

}).filter('search', function() {
  return function(input, search) {
    if (!input) return input;
    if (!search) return input;
    var expected = ('' + search).toLowerCase();
    var result = [];
    angular.forEach(input, function(id, name) {
      if (name.toLowerCase().indexOf(expected) !== -1) {
        result.push(name);
      }
    });
    return result;
  }
});


