// public/javascripts/controllers/ManageController.js
app.controller('ManageController', function($scope) {
  $scope.accounts = [{
    _id: 'asdlfasdfasdhgashdgh',
    name: 'CORe',
    value: '100.00',
    allocated: '100.00',
    unallocated: '50.00',
    virtualFunds: [{
      _id: 'asdlfgasdfgasd',
      name: 'CORe',
      value: '60.00',
      allocated: '20.00',
      unallocated: '30.00'
    },{
      _id: 'asdlfgasdfgasd',
      name: 'SAC',
      value: '60.00',
      allocated: '20.00',
      unallocated: '30.00'
    }]
  },{
    _id: 'asdlfasdfasdhgashdgh',
    name: 'CORe',
    value: '100.00',
    allocated: '100.00',
    unallocated: '50.00',
    virtualFunds: [{
      _id: 'asdlfgasdfgasd',
      name: 'CORe',
      value: '60.00',
      allocated: '20.00',
      unallocated: '30.00'
    },{
      _id: 'asdlfgasdfgasd',
      name: 'SAC',
      value: '60.00',
      allocated: '20.00',
      unallocated: '30.00'
    }]
  }];
});