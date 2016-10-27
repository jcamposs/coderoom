var SCOPES = ['https://www.googleapis.com/auth/drive'];

Template.login.events({
  'submit .signin': function(event) {
    event.preventDefault();

    var options = {
      requestPermissions: ['email', SCOPES],
      requestOfflineToken: true,
      forceApprovalPrompt: true
    };

    Meteor.loginWithGoogle(options, function (error) {
      if (error)
        console.log(error);
      else {
        Router.go('home');
      }
    });
  }
});
