Template.sidebar.helpers({
  user: function() {
    return Session.get('user');
  }
});

Template.sidebar.created = function() {
  // Subscribe user data
  var subs = this.subscribe("userData");

  // Do reactive stuff when subscribe is ready
  this.autorun(function() {
    if(!subs.ready()) {
      return;
    }

    var user = Meteor.user().services.google;
    Session.set('user', user);
  });
};
