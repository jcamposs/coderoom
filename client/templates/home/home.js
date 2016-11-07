Template.home.helpers({
  rooms: function () {
    return Rooms.find({owner: Meteor.userId()});
  }
});
