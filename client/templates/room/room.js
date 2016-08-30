function initRoom(name) {
  var room = Rooms.findOne({name: name});

  if (room) {
    Session.set('currentRoom', room._id);
    ifaceMedia = MediaManager.initUserMedia(room._id);
  } else {
    Room.create(name, function(roomId) {
      Session.set('currentRoom', roomId);
      ifaceMedia = MediaManager.initUserMedia(roomId);
    });
  }
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
      ifaceMedia.setParticipantOnline(participantEl);
    }
  },
});

Tracker.autorun(function() {
  if(Session.get('recording')) {
    // var role = $('input[name=role]:checked').val() || 'viewer';
    //
    // if (role == 'admin') {
    //   recordEditor(ace.edit('editor'));
    // }
    console.log(Session.get('upload'))
    ifaceMedia.recordMedia();
  }

  if(Session.get('upload')) {
    ifaceMedia.stopRecordMedia();
    // var room = Session.get('currentRoom');
    // console.log(Room.getTimeline(room))
  }
});
