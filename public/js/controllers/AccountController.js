// public/js/controllers/AccountController.js
app.controller('AccountController', function($scope, $uibModal, AuthService) {
  
  $scope.alerts = [];

  $scope.openChangePasswordModal = function () {
    var modalInstance = $uibModal.open({
      animation: false,
      templateUrl: 'changePasswordModal.html',
      controller: 'ChangePasswordCtrl'
    });
    modalInstance.result.then(function () {
      $scope.alerts.push({
        type: 'success',
        msg: 'Password changed successfully'
      });
    });
  };

  $scope.openChangeEmailModal = function () {
    var modalInstance = $uibModal.open({
      animation: false,
      templateUrl: 'changeEmailModal.html',
      controller: 'ChangeEmailCtrl'
    });
    modalInstance.result.then(function() {
      $scope.alerts.push({
        type: 'success',
        msg: 'Email changed successfully'
      });
    });
  };

  $scope.dismissAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

}).controller('ChangePasswordCtrl',
    function ($scope, $uibModalInstance, AuthService) {

  $scope.alerts = [];

  $scope.save = function() {
    if ($scope.newPassword != $scope.confirmNewPassword) {
      $scope.alerts.push({
        type: 'danger',
        msg: 'Wrong current password.'
      });
    } else {
      AuthService.changePassword($scope.currentPassword, $scope.newPassword)
      .then(function(response) {
        if (!response.success) {
          $scope.alerts.push({
            type: 'danger',
            msg: response.error
          });
        } else {
          $uibModalInstance.close();
        }
      });
    }
  };
  $scope.cancel = function() {
    $uibModalInstance.dismiss();
  };
  $scope.dismissAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

}).controller('ChangeEmailCtrl',
    function($scope, $uibModalInstance, AuthService) {
  $scope.alerts = [];
  $scope.save = function () {
    if ($scope.emailForm.email.$error.email) {
      $scope.alerts.push({
        type: 'danger',
        msg: 'Invalid email.'
      });
    } else {
      AuthService.changeEmail($scope.newEmail).then(function(success) {
        if (!success) {
          $scope.alerts.push({
            type: success ? 'success' : 'danger',
            msg: 
                success ? 'Email changed successfully.' : 'Email change failed.'
          });
        } else {
          $uibModalInstance.close();
        }
      });
    }
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss();
  };
  $scope.dismissAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
});