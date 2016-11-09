var SCOPES = ['https://www.googleapis.com/auth/drive'];

Template.login.events({
  'submit .signin': function(event) {
    event.preventDefault();

    var options = {
      requestPermissions: ['email', SCOPES],
      requestOfflineToken: true,
      forceApprovalPrompt: true
    };

    Meteor.loginWithGoogle(options, function (err) {
      if (err)
        throwAlert('error', 'Error in login process, try again please', 'alert-circle');
      else {
        Router.go('dashboard');
      }
    });
  }
});
