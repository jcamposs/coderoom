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

  var timeline = Timeline.create();
  RoomManager.setTimeline(timeline);

  if(!Session.get('document')) {
    var docId = $('.docs__collection li')[0].getAttribute("data-id");
    Session.set('document', docId);
  }

  setTimeout(function(){
    EditorManager.init(ace.edit('editor'), timeline);
  }, 3000);
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
    console.log('recording');

    if (RoomManager.getLocalUser().role == 'admin') {
      var timeline = RoomManager.getTimeline();
      timeline.clear();

      timeline.insertEvent({
        type: 'video',
        timestamp: timeline.getCurrentTime(),
        toDo: 'insertVideo',
        arg: RoomManager.getLocalStream().id
      });

      createRecording('recordingTest24sep');
    }

    MediaManager.startRecord();
  };

  if(Session.get('upload')) {
    MediaManager.stopRecord();
    if (RoomManager.getLocalUser().role == 'admin') {
      var recordId = Session.get('recordId');
      var timeline = RoomManager.getTimeline();
      Recordings.update({_id: recordId},{"$push":{RC: timeline.getEvents()}});
    }
  }
});

function createRecording(title) {
  var recording = {
    title: title
  };

  Meteor.call('insertRecording', recording, function(err, result){
    if(err){
      console.log("Error when create recording");
    }
    if (result){
      var idRecord = result._id;
      Session.set('recordId', idRecord);
      console.log("Recording created ok " + idRecord);
    }
  });
};
