// public/js/controllers/LoginController.js
app.controller('LoginController', function($scope, AuthService) {
  
  $scope.loginForm = function() {
    AuthService.login({
      username: $scope.username,
      password: $scope.password
    });
    $scope.username = '';
    $scope.password = '';
  }

});