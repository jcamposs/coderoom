Template.home.created = function() {
  Session.set('loading', true);
}

Template.home.rendered = function() {
  Session.set('loading', false);
}

Template.home.helpers({
  // recordings: function () {
  //   return Recordings.find();
  // }
  rooms: function () {
    return Rooms.find();
  }
});

// Template.registerHelper('getColaboratorAvatar', function (id) {
//   var user = Meteor.users.findOne({_id: id}).services.google;
//   return user.picture;
// });

// Template.home.events({
//   'submit .signin': function(event, template) {
//     event.preventDefault();
//
//     var target = event.target;
//     var roomName = target.text.value;
//
//     // Update role user
//     var role = target.role.checked ? 'admin' : 'viewer';
//     Meteor.users.update({_id: Meteor.user()._id}, {$set: {'profile.role': role}});
//
//     Router.go('room',{name: roomName});
//   }
// });
