// public/js/controllers/UserController.js
app.controller('UserController', function($scope, AuthService) {
  
  $scope.signupForm = function() {
    AuthService.createAccount({
      username: $scope.username,
      password: $scope.password
    });    
  }

});