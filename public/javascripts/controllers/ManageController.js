// public/javascripts/controllers/ManageController.js
app.controller('ManageController', function(AuthService) {
  var MngCtrl = this;
  this.pendingUsers = [];
  this.alert = {
    isActive: false,
    type:'',
    msg:''
  };

  AuthService.getPendingUsers().then(function(pendingUsers) {
    MngCtrl.pendingUsers = pendingUsers || [];
    console.log(MngCtrl.pendingUsers);
  });

  this.resolveUser = function(index, isApproved) {
    console.log(this.pendingUsers[index]);
    AuthService.resolveUser(this.pendingUsers[index], isApproved).then(function(response) {
      MngCtrl.alert.isActive = true;
      MngCtrl.alert.type = response.isSuccessful ? 'success' : 'danger';
      MngCtrl.alert.msg = (response.isSuccessful ? 'SUCCESS' : 'FAILURE') +
          ' ' + MngCtrl.pendingUsers[index].username + (isApproved ? ' approved' : ' rejected');
      if (response.isSuccessful) {
        MngCtrl.pendingUsers.splice(index, 1);
      }
    });
  };
});