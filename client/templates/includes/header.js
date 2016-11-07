Template.header.created = function() {
  // Subscribe user data
  var subs = this.subscribe("userData");

  // Do reactive stuff when subscribe is ready
  this.autorun(function() {
    if(!subs.ready()) {
      return;
    }

    var user = Meteor.user();
    if(user) {
      Session.set('user', user.services.google);
    }
  });
};

Template.header.helpers({
  isMain: function() {
    return !Session.get('isEdition') && !Session.get('isPlayback');
  }
});

Template.header.events({
  'click .btn-js-logout': function() {
    Meteor.logout();
  }
});
