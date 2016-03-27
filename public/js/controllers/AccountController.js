// public/js/controllers/AccountController.js
app.controller('AccountController', function($scope, $uibModal, AuthService) {
  
  $scope.alerts = [];

  $scope.nameEditor = {
    isCollapsed: true
  };
  $scope.newName = {
    value: '',
    validation: {
      isValid: 'empty',
      helpBlock: ''
    },
    validate: function() {
      if (typeof $scope.newName.value != 'string' ||
          $scope.newName.value.length < 1) {
        $scope.newName.validation.isValid = 'invalid';
        $scope.newName.validation.helpBlock = 'Name cannot be empty'
      } else {
        $scope.newName.validation.isValid = 'valid';
      }
    }
  }

  $scope.emailEditor = {
    isCollapsed: true
  };
  $scope.newEmail = {
    value: '',
    validation: {
      isValid: 'empty',
      helpBlock: ''
    },
    validate: function() {
      console.log($scope.newEmail)
      if (!$scope.newEmail.value || $scope.emailForm.email.$error.email) {
        $scope.newEmail.validation.isValid = 'invalid';
        $scope.newEmail.validation.helpBlock = 'Invalid email address'
      } else {
        $scope.newEmail.validation.isValid = 'valid';
      }
    }
  }

  $scope.passwordEditor = {
    isCollapsed: true,
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  };

  $scope.cancelEditName = function() {
    $scope.nameEditor.isCollapsed = true;
    $scope.newName.validation = {
      isvalid: 'empty',
      helpBlock: ''
    };
    $scope.newName.value = '';
  };

  $scope.cancelEditEmail = function() {
    $scope.emailEditor.isCollapsed = true;
    $scope.newEmail.validation = {
      isvalid: 'empty',
      helpBlock: ''
    };
    $scope.newEmail.value = '';
  };

  $scope.cancelEditPassword = function() {
    $scope.passwordEditor = {
      isCollapsed: true,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    };
  };

  $scope.saveEditName = function() {
    if ($scope.newName.validation.isValid == 'valid') {
      AuthService.changeName($scope.newName.value)
      .then(function(success) {
        $scope.alerts.push({
          type: success ? 'success' : 'danger',
          msg: success ? 'Name changed successfully' : 'Name change failed'
        });
        $scope.nameEditor.isCollapsed = success;
        if (success) {
          $scope.newName.value = '';
          $scope.newName.validation = {
            isValid: 'empty',
            helpBlock: ''
          };
        }
      });
    }
  };

  $scope.saveEditEmail = function() {
    if ($scope.newEmail.validation.isValid == 'valid') {
      AuthService.changeEmail($scope.newEmail.value)
      .then(function(success) {
        $scope.alerts.push({
          type: success ? 'success' : 'danger',
          msg: success ? 'Email changed successfully' : 'Email change failed'
        });
        $scope.emailEditor.isCollapsed = success;
        if (success) {
          $scope.newEmail.value = '';
          $scope.newEmail.validation = {
            isValid: 'empty',
            helpBlock: ''
          };
        }
      });
    }
  };

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