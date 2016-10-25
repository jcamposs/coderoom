Template.home.created = function() {
  Session.set('loading', true);
}

Template.home.rendered = function() {
  Session.set('loading', false);
}

Template.home.helpers({
  recordings: function () {
    return Recordings.find();
  },
  rooms: function () {
    return Rooms.find();
  }
});
