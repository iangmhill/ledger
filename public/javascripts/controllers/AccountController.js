/**
 * File: public/javascripts/controllers/AccountController.js
 * Description: Controls the user account page which displays user profile
 *     information and allows users to change their account information.
 */
app.controller('AccountController', function($uibModal, AuthService) {
  var AccCtrl = this;
  // List of alerts notifying the user of the result of an operation
  this.alerts = [];
  this.dismissAlert = function(index) {
    this.alerts.splice(index, 1);
  };

  // Initialize the state of the nameEditor and its input fields
  this.nameEditor = {
    isCollapsed: true
  };
  this.newName = {
    value: '',
    validation: {
      isValid: 'empty',
      helpBlock: ''
    },
    validate: function() {
      if (typeof this.value != 'string' ||
          this.value.length < 1) {
        this.validation.isValid = 'invalid';
        this.validation.helpBlock = 'Name cannot be empty';
      } else {
        this.validation.isValid = 'valid';
      }
    }
  }

  // Initialize the scope of the emailEditor and its input fields
  this.emailEditor = {
    isCollapsed: true
  };
  this.newEmail = {
    value: '',
    validation: {
      isValid: 'empty',
      helpBlock: ''
    },
    validate: function() {
      if (!this.value || AccCtrl.emailForm.email.$error.email) {
        this.validation.isValid = 'invalid';
        this.validation.helpBlock = 'Invalid email address';
      } else {
        this.validation.isValid = 'valid';
      }
    }
  }

  // Initialize the scope of the passwordEditor and its input fields
  this.passwordEditor = {
    isCollapsed: true
  };
  this.currentPassword = {
    value: '',
    validation: {
      isValid: 'empty',
      helpBlock: ''
    },
    clearValidation: function() {
      this.validation = {
        isValid: 'empty',
        helpBlock: ''
      };
    }
  }
  this.newPassword = {
    value: '',
    validation: {
      isValid: 'empty',
      helpBlock: ''
    },
    validate: function() {
      var regex = new RegExp("^[a-zA-Z0-9]+$"); // give regex a more semantic variable name? e.g. var validPasswordRegex = ...
      if (typeof this.value !== 'string' ||
          !regex.test(this.value)) {
        this.validation.isValid = 'invalid';
        this.validation.helpBlock =
            'Password must only use letters and numbers and cannot be empty';
      } else {
        this.validation.isValid = 'valid';
      }
    }
  }
  this.confirmNewPassword = {
    value: '',
    validation: {
      isValid: 'empty',
      helpBlock: ''
    },
    validate: function() {
      if (AccCtrl.newPassword.validation.isValid == 'valid') {
        if (AccCtrl.newPassword.value !== this.value) {
          this.validation.isValid = 'invalid';
          this.validation.helpBlock = 'Passwords to not match';
        } else {
          this.validation.isValid = 'valid';
        }
      }
    }
  }

  // Collapsable form to edit a user's name
  this.saveEditName = function() {
    this.newName.validate();
    if (this.newName.validation.isValid == 'valid') {
      AuthService.changeName(this.newName.value)
      .then(function(success) {
        AccCtrl.alerts.push({
          type: success ? 'success' : 'danger',
          msg: success ? 'Name changed successfully' : 'Name change failed'
        });
        if (success) {
          AccCtrl.closeEditName();
        }
      });
    }
  };
  this.closeEditName = function() {
    this.nameEditor.isCollapsed = true;
    this.newName.validation = {
      isValid: 'empty',
      helpBlock: ''
    };
    this.newName.value = '';
  };

  // Collapsable form to edit a user's email
  this.saveEditEmail = function() {
    this.newEmail.validate();
    if (this.newEmail.validation.isValid == 'valid') {
      AuthService.changeEmail(this.newEmail.value)
      .then(function(success) {
        AccCtrl.alerts.push({
          type: success ? 'success' : 'danger',
          msg: success ? 'Email changed successfully' : 'Email change failed'
        });
        if (success) {
          AccCtrl.closeEditEmail();
        }
      });
    }
  };
  this.closeEditEmail = function() {
    this.emailEditor.isCollapsed = true;
    this.newEmail.validation = {
      isValid: 'empty',
      helpBlock: ''
    };
    this.newEmail.value = '';
  };

  // Collapsable form to edit a user's password
  this.saveEditPassword = function() {
    this.newPassword.validate();
    this.confirmNewPassword.validate();
    if (this.newPassword.validation.isValid == 'valid' &&
        this.confirmNewPassword.validation.isValid == 'valid') {
      AuthService.changePassword(
          this.currentPassword.value, this.newPassword.value)
      .then(function(res) {
        if (res.isAuthenticated) {
          AccCtrl.alerts.push({
            type: res.isSuccessful ? 'success' : 'danger',
            msg: res.isSuccessful ? 'Password changed successfully' : res.error
          });
        } else {
          AccCtrl.currentPassword.validation.isValid = 'invalid';
          AccCtrl.currentPassword.validation.helpBlock =
            'Incorrect password';
        }
        if (res.isSuccessful) { AccCtrl.closeEditPassword(); }
      });
    }
  };
  this.closeEditPassword = function() {
    this.passwordEditor.isCollapsed = true;
    this.currentPassword.validation = {
      isValid: 'empty',
      helpBlock: ''
    };
    this.currentPassword.value = '';
    this.newPassword.validation = {
      isValid: 'empty',
      helpBlock: ''
    };
    this.newPassword.value = '';
    this.confirmNewPassword.validation = {
      isValid: 'empty',
      helpBlock: ''
    };
    this.confirmNewPassword.value = '';
  };
});
