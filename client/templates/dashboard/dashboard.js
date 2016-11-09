Template.dashboard.created = function() {
  Session.set('dashboardPage', true);
};

Template.dashboard.destroyed = function() {
  Session.set('dashboardPage', false);
};

Template.dashboard.helpers({
  rooms: function () {
    return Rooms.find({owner: Meteor.userId()});
  }
});
