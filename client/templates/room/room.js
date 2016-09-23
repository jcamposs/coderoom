function generateProfile() {
  var usr = Meteor.user();

  return {
    name: usr.services.google.name,
    email: usr.services.google.email,
    img: usr.services.google.picture,
    role: usr.profile.role,
    token: usr.services.google.accessToken
  };
}

Template.room.rendered = function() {
  var roomName = this.data;
  var profileUsr = generateProfile();

  var options = {
    // the id/element dom element that will hold "our" video
    localVideoEl: '',
    // the id/element dom element that will hold remote videos
    remoteVideosEl: '',
    // immediately ask for camera access
    autoRequestMedia: true,
    enableDataChannels: true,
    room: roomName,
    nick: profileUsr
  };

  var webrtc = MediaManager.connect(options);

  //save webrtc & roomName in manager
  RoomManager.setWebRTC(webrtc);
  RoomManager.setRoomName(roomName);
  RoomManager.setLocalUser(profileUsr);
};

Template.room.events({
  'click .room_participant-js': function (e) {
    // if(RoomManager.getLocalUser().role == 'admin') {
    //   var participantId = e.currentTarget.id;
    //   var msg = {"id": participantId};
    //   MediaManager.sendToAllMessage('muteMedia');
    //   MediaManager.sendToAllMessage('setMainParticipant', msg);
    //
    //   var participants = ParticipantsManager.getParticipants();
    //   var searchedParticipant = participants[participantId];
    //   ParticipantsManager.updateMainParticipant(searchedParticipant);
    // }
  }
});

Tracker.autorun(function() {
  if(Session.get('recording')) {
    console.log('recording')
    MediaManager.startRecord();
  };

  if(Session.get('upload')) {
    MediaManager.stopRecord();
  }
});
