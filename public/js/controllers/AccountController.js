/**
 * File: public/js/controllers/AccountController.js
 * Description: Controls the user account page which displays user profile
 *     information and allows users to change their account information.
 */
app.controller('AccountController', function($scope, $uibModal, AuthService) {
  
  // List of alerts notifying the user of the result of an operation
  $scope.alerts = [];
  $scope.dismissAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  // Initialize the state of the nameEditor and its input fields
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
        $scope.newName.validation.helpBlock = 'Name cannot be empty';
      } else {
        $scope.newName.validation.isValid = 'valid';
      }
    }
  }

  // Initialize the scope of the emailEditor and its input fields
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
        $scope.newEmail.validation.helpBlock = 'Invalid email address';
      } else {
        $scope.newEmail.validation.isValid = 'valid';
      }
    }
  }

  // Initialize the scope of the passwordEditor and its input fields
  $scope.passwordEditor = {
    isCollapsed: true
  };
  $scope.currentPassword = {
    value: '',
    validation: {
      isValid: 'empty',
      helpBlock: ''
    },
    clearValidation: function() {
      $scope.currentPassword.validation = {
        isValid: 'empty',
        helpBlock: ''
      };
    }
  }
  $scope.newPassword = {
    value: '',
    validation: {
      isValid: 'empty',
      helpBlock: ''
    },
    validate: function() {
      var regex = new RegExp("^[a-zA-Z0-9]+$");
      if (typeof $scope.newPassword.value !== 'string' ||
          !regex.test($scope.newPassword.value)) {
        $scope.newPassword.validation.isValid = 'invalid';
        $scope.newPassword.validation.helpBlock = 
            'Password must only use letters and numbers';
      } else {
        $scope.newPassword.validation.isValid = 'valid';
      }
    }
  }
  $scope.confirmNewPassword = {
    value: '',
    validation: {
      isValid: 'empty',
      helpBlock: ''
    },
    validate: function() {
      console.log($scope.newPassword);
      console.log($scope.confirmNewPassword);
      if ($scope.newPassword.value !== $scope.confirmNewPassword.value) {
        $scope.confirmNewPassword.validation.isValid = 'invalid';
        $scope.confirmNewPassword.validation.helpBlock = 
            'Passwords to not match';
      } else {
        $scope.confirmNewPassword.validation.isValid = 'valid';
      }
    }
  }

  // Collapsable form to edit a user's name
  $scope.saveEditName = function() {
    if ($scope.newName.validation.isValid == 'valid') {
      AuthService.changeName($scope.newName.value)
      .then(function(success) {
        $scope.alerts.push({
          type: success ? 'success' : 'danger',
          msg: success ? 'Name changed successfully' : 'Name change failed'
        });
        if (success) {
          $scope.closeEditName();
        }
      });
    }
  };
  $scope.closeEditName = function() {
    $scope.nameEditor.isCollapsed = true;
    $scope.newName.validation = {
      isValid: 'empty',
      helpBlock: ''
    };
    $scope.newName.value = '';
  };

  // Collapsable form to edit a user's email
  $scope.saveEditEmail = function() {
    if ($scope.newEmail.validation.isValid == 'valid') {
      AuthService.changeEmail($scope.newEmail.value)
      .then(function(success) {
        $scope.alerts.push({
          type: success ? 'success' : 'danger',
          msg: success ? 'Email changed successfully' : 'Email change failed'
        });
        if (success) {
          $scope.closeEditEmail();
        }
      });
    }
  };
  $scope.closeEditEmail = function() {
    $scope.emailEditor.isCollapsed = true;
    $scope.newEmail.validation = {
      isValid: 'empty',
      helpBlock: ''
    };
    $scope.newEmail.value = '';
  };

  // Collapsable form to edit a user's password
  $scope.saveEditPassword = function() {
    if ($scope.newPassword.validation.isValid == 'valid' &&
        $scope.confirmNewPassword.validation.isValid == 'valid') {
      AuthService.changePassword(
          $scope.currentPassword.value, $scope.newPassword.value)
      .then(function(res) {
        if (res.isAuthenticated) {
          $scope.alerts.push({
            type: res.success ? 'success' : 'danger',
            msg: res.success ? 'Password changed successfully' : res.error
          });
        } else {
          $scope.currentPassword.validation.isValid = 'invalid';
          $scope.currentPassword.validation.helpBlock = 
            'Incorrect password';
        }
        if (res.success) { $scope.closeEditPassword(); }
      });
    }
  };
  $scope.closeEditPassword = function() {
    $scope.passwordEditor.isCollapsed = true;
    $scope.currentPassword.validation = {
      isValid: 'empty',
      helpBlock: ''
    };
    $scope.currentPassword.value = '';
    $scope.newPassword.validation = {
      isValid: 'empty',
      helpBlock: ''
    };
    $scope.newPassword.value = '';
    $scope.confirmNewPassword.validation = {
      isValid: 'empty',
      helpBlock: ''
    };
    $scope.confirmNewPassword.value = '';
  };
});