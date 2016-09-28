var SCOPES = ['https://www.googleapis.com/auth/drive']

Template.login.events({
  'submit .signin': function(event, template) {
    event.preventDefault();

    Meteor.loginWithGoogle({requestPermissions: ['email', SCOPES]}, function (error, r) {
      if (error)
        console.log(error);
      else {
        Router.go('home');
      }
    });
  }
});
