Template.dashboard.created = function() {
  Session.set('dashboardPage', true);
  Session.set('loadingLayout', true);
};

Template.dashboard.rendered = function() {
  Session.set('loadingLayout', false);
  $('.content').show();
};

Template.dashboard.destroyed = function() {
  Session.set('dashboardPage', false);
};

Template.dashboard.helpers({
  rooms: function () {
    return Rooms.find({owner: Meteor.userId()});
  }
});
