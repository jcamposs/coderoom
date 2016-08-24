function initRoom(name) {
  var room = Rooms.findOne({name: name});

  if (room) {
    Session.set('currentRoom', room._id);
    ifaceMedia = MediaManager.initUserMedia(Session.get('currentRoom'));
  } else {
    Room.create(name, function(roomId) {
      Session.set('currentRoom', roomId);
      ifaceMedia = MediaManager.initUserMedia(Session.get('currentRoom'));
    });
  }
}

Template.room.created = function() {

};

Template.room.rendered = function() {
  var roomName = this.data;
  initRoom(roomName);
};

Template.room.events({
  'click .room_participant-js': function (e) {
    var role = $('input[name=role]:checked').val() || 'viewer';

    if (role == 'admin') {
      var participantEl = $(e.currentTarget);
      ifaceMedia.setUserOnline(participantEl);
    }
  },
});
