// public/js/controllers/LoginController.js
app.controller('LoginController', function($scope, AuthService) {
  $scope.username = '';
  $scope.password = '';
  $scope.alerts = [];

  $scope.loginForm = function() {
    AuthService.login({
      username: $scope.username,
      password: $scope.password
    }).then(function(success) {
      $scope.alerts.push({
        type: success ? 'success' : 'danger',
        msg: success ? 'Login successful!' : 'Invalid credentials.'
      });
    });
    $scope.password = '';
  }

  $scope.dismissAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
});