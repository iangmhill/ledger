// public/javascripts/controllers/LoginController.js
app.controller('LoginController', function(AuthService) {
  this.username = '';
  this.password = '';
  this.alerts = [];

  this.loginForm = function() {
    var LgnCtrl = this;
    AuthService.login({
      username: this.username,
      password: this.password
    }).then(function(success) {
      LgnCtrl.alerts.push({
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
