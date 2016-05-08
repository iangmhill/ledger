// public/javascripts/controllers/RegisterController.js

app.controller('RegisterController', function(AuthService) {

  var alertMessages = {
    REGISTRATION_SUCCESSFUL:
        ', your account has been created and awaits admin approval',
    REGISTRATION_FAILED:
        'Sorry! We were unable to create your account. ' +
        'Please contact the system administrator.',
    REGISTRATION_INVALID:
        'The profile information you have entered is invalid.'
  };

  var RegCtrl = this;
  this.alert = {
    isActive: false,
    type: '',
    msg: ''
  };

  this.username = {
    value: '',
    validation: {
      isValid: 'empty',
      helpBlock: ''
    },
    validate: function() {
      if (!this.value || this.value.length < 3) {
        this.validation.isValid = 'invalid';
        this.validation.helpBlock =
            'Username must be at least 3 characters long';
      } else {
        var username = this;
        AuthService.checkUniqueUsername(this.value).then(function(isUnique) {
          username.validation.isValid = isUnique ? 'valid' : 'invalid';
          username.validation.helpBlock = isUnique ? '' : 'Username taken'
        });
      }
    }
  }

  this.name = {
    value: '',
    validation: {
      isValid: 'empty',
      helpBlock: ''
    },
    validate: function() {
      if (!this.value) {
        this.validation.isValid = 'invalid';
        this.validation.helpBlock = 'Name field cannot be empty';
      } else {
        this.validation.isValid = 'valid';
      }
    }
  }

  this.email = {
    value: '',
    validation: {
      isValid: 'empty',
      helpBlock: ''
    },
    validate: function() {
      if (!this.value || RegCtrl.registrationForm.email.$error.email) {
        this.validation.isValid = 'invalid';
        this.validation.helpBlock = 'Invalid email address';
      } else {
        this.validation.isValid = 'valid';
      }
    }
  }

  this.password = {
    value: '',
    validation: {
      isValid: 'empty',
      helpBlock: ''
    },
    validate: function() {
      var regex = new RegExp("^[a-zA-Z0-9]+$");
      if (!this.value || !regex.test(this.value)) {
        this.validation.isValid = 'invalid';
        this.validation.helpBlock =
            'Password must only use letters and numbers';
      } else {
        this.validation.isValid = 'valid';
      }
    }
  }

  this.clear = function(field) {
    field.value = '';
    field.validation.isValid = 'empty';
    field.validation.helpBlock = '';
  };

  this.submitRegistrationForm = function() {
    var RegCtrl = this; // isn't this done globally? (this file, line 15)
    this.username.validate();
    this.password.validate();
    this.name.validate();
    this.email.validate();
    if (this.username.validation.isValid == 'valid' &&
        this.password.validation.isValid == 'valid' &&
        this.name.validation.isValid == 'valid' &&
        this.email.validation.isValid == 'valid') {
      AuthService.register({
        username: this.username.value,
        password: this.password.value,
        name:     this.name.value,
        email:    this.email.value
      }).then(function(response) {
        if (response.isSuccessful) {
          RegCtrl.alert.msg =
              RegCtrl.name.value + alertMessages.REGISTRATION_SUCCESSFUL;
          RegCtrl.alert.type = 'success';
          RegCtrl.clear(RegCtrl.username);
          RegCtrl.clear(RegCtrl.password);
          RegCtrl.clear(RegCtrl.name);
          RegCtrl.clear(RegCtrl.email);
        } else {
          RegCtrl.alert.type = 'danger';
          if (response.isValid) {
            RegCtrl.alert.msg = alertMessages.REGISTRATION_FAILED
          } else {
            RegCtrl.alert.msg = alertMessages.REGISTRATION_INVALID
          }
        }
        RegCtrl.alert.isActive = true;
      });
    }
  }
});
