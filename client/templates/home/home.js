Template.home.created = function() {
  Session.set('isMain', true);
};

Template.home.destroyed = function() {
  Session.set('isMain', false);
};

Template.home.helpers({
  rooms: function () {
    return Rooms.find({owner: Meteor.userId()});
  }
});
