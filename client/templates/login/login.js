var SCOPES = ['https://www.googleapis.com/auth/drive']

Template.login.events({
  'submit .signin': function(event, template) {
    event.preventDefault();

    var target = event.target;
    var roomName = target.text.value;

    Meteor.loginWithGoogle({requestPermissions: ['email', SCOPES]}, function (error, r) {
      if (error)
        console.log(error);
      else {
        // Update role user
        var role = target.role.checked ? 'admin' : 'viewer';
        Meteor.users.update({_id: Meteor.user()._id}, {$set: {'profile.role': role}});

        Router.go('room',{name: roomName});
      }
    });
  }
});
