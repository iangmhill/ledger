// public/js/controllers/SignupController.js
app.controller('SignupController', function(AuthService) {
  var SgnpCtrl = this;
  this.alerts = [];

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
          console.log(username);
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
      if (!this.value || SgnpCtrl.signupForm.email.$error.email) {
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

  this.signupForm = function() {
    var SgnpCtrl = this;
    AuthService.signup({
      username: this.username,
      password: this.password
    }).then(function(success) {
      console.log(this);
      SgnpCtrl.alerts.push({
        type: success ? 'success' : 'danger',
        msg: success ? 'Login successful!' : 'Invalid credentials.'
      });
    });
    this.password = '';
  }

  this.dismissAlert = function(index) {
    this.alerts.splice(index, 1);
  };
});