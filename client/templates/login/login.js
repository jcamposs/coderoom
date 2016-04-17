var SCOPES = ['https://www.googleapis.com/auth/drive']

Template.login.events({
  'click .btn-js-signin': function(e, template){
    Meteor.loginWithGoogle({requestPermissions: ['email', SCOPES]}, function (error) {
      if (error)
        console.log(error);
      else {
        console.log(Meteor.user())
      }
    });
  }
});
