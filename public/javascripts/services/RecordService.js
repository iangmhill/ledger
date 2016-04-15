// public/javascripts/services/RecordService.js
app.service('RecordService', function($http) {

    this.createRecord = function(recordData) {
    console.log("recordService: " + recordData);
    $http.post('/api/createRecord', recordData).then(function (response) {
      console.log("response.data: " + response.data.success);
      });
  };

});