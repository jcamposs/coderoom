Template.room.created = function() {
  var roomOwner = this.data.owner;
  var defaultDoc = this.data._id;

  // Initialize session variables
  Session.set('isEdition', true);
  Session.set('isModerator', roomOwner === Meteor.userId());
  Session.set('document', defaultDoc);
  Session.set('live', false);
  Session.set('recording', false);
  Session.set('stopping', false);
  Session.set('uploading', false);
  Session.set('loadingMedia', true);
};

Template.room.rendered = function() {
  var roomId = this.data._id;
  var participantProfile = getParticipantProfile();

  var options = {
    autoRequestMedia: true,
    enableDataChannels: true,
    room: roomId,
    nick: participantProfile,
    socketio: {'force new connection': true}
  };

  var webrtc = MediaManager.connect(options);

  // Save room config and webrtc in manager
  RoomManager.setRoomConfig(this.data);
  RoomManager.setWebRTC(webrtc);
};

Template.room.destroyed = function() {
  // Stop video and leave room
  var webrtc = RoomManager.getWebRTC();
  webrtc.stopLocalVideo();
  webrtc.leaveRoom();

  // Reset session variables
  Session.set('isEdition', false);
  Session.set('isModerator', false);
  Session.set('document', undefined);
  Session.set('live', false);
  Session.set('recording', false);
  Session.set('stopping', false);
  Session.set('uploading', false);
  Session.set('loadingMedia', false);
};

Template.room.helpers({
  isModerator: function() {
    return Session.get('isModerator');
  }
});

Template.room.events({
  'click .room_participant-js': function(e) {
    if(Session.get('isModerator') && Session.get('live')) {
      var pId = $(e.target).closest('.room_participant-js').attr('id');
      MediaManager.updateSecondaryParticipant(pId);
    }
  }
});

function getParticipantProfile() {
  var googleService = Meteor.user().services.google;
  return {
    name: googleService.name,
    email: googleService.email,
    image: googleService.picture,
    role: Session.get('isModerator') ? 'moderator' : 'speaker'
  };
};
