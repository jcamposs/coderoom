var SCOPES = ['https://www.googleapis.com/auth/drive'];

Template.home.events({
  'click .btn-js-signup-google': function(e) {
    e.preventDefault();

    var options = {
      requestPermissions: ['email', SCOPES],
      requestOfflineToken: true,
      forceApprovalPrompt: true
    };

    Meteor.loginWithGoogle(options, function (error) {
      if (error)
        console.log(error);
      else {
        Router.go('dashboard');
      }
    });
  }
});
