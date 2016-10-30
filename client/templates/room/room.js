Template.room.created = function() {
  var roomOwner = this.data.owner;
  var defaultDoc = this.data._id;

  Session.set('isModerator', roomOwner === Meteor.userId());
  Session.set('document', defaultDoc);
  Session.set('live', false);
  Session.set('recording', false);
  Session.set('stopping', false);
};

Template.room.rendered = function() {
  Session.set('loadingMedia', true);
  console.log('Loading room...');

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

  //save webrtc & roomName in manager
  RoomManager.setWebRTC(webrtc);
};

Template.room.destroyed = function() {
  var webrtc = RoomManager.getWebRTC();
  webrtc.stopLocalVideo();
  webrtc.leaveRoom();
};

Template.room.helpers({
  isModerator: function() {
    return Session.get('isModerator');
  }
});

Template.room.events({
  'click .room_participant-js': function(e) {
    if(Session.get('isModerator') && Session.get('live')) {
      var participantId = $(e.target).closest('.room_participant-js').attr('id');
      MediaManager.updateSecondaryParticipant(participantId);
    }
  }
});

function getParticipantProfile() {
  var googleService = Meteor.user().services.google;

  return {
    //id: Meteor.userId(),
    name: googleService.name,
    email: googleService.email,
    image: googleService.picture,
    role: Session.get('isModerator') ? 'moderator' : 'speaker'
  };
};
