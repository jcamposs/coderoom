Template.header.created = function() {
  // Subscribe user data
  var subs = this.subscribe('userData');

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
  },

  user: function() {
    return Session.get('user');
  }
});

Template.header.events({
  'click .btn-js-logout': function(e) {
    e.preventDefault();
    Meteor.logout();
  }
});
