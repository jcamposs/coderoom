var timeline;

Template.room.created = function() {
  var defaultDoc = this.data._id;
  var sessionRole = this.data.owner;

  Session.set('document', defaultDoc);
  Session.set('isModerator', sessionRole === Meteor.user()._id)
};

Template.room.rendered = function() {
  var roomId = this.data._id;
  var localPeerData = getLocalPeerData();

  var options = {
    autoRequestMedia: true,
    enableDataChannels: true,
    room: roomId,
    nick: localPeerData,
    socketio: {'force new connection': true}
  };

  var webrtc = MediaManager.connect(options);

  //save webrtc & roomName in manager
  RoomManager.setWebRTC(webrtc);
  RoomManager.setLocalUser(localPeerData);

  var editor = ace.edit('editor');
  setTimeout(function(){
    if(Session.get('isModerator')) {
      editor.setReadOnly(false);
    }
    editor.setValue('');
    Session.set('loading', false);
  }, 3000);

  var mainVideo = document.getElementById('main-video');
  mainVideo.addEventListener('timeupdate',function(){
    var time = 0;
    if(Session.get('recording')) {
      time = timeline.getCurrentTime();
    }
    $(".room__controls__current-time").text(formatTime(time));
  }, false);

  // Create timeline
  timeline = Timeline.create({mediaEl: mainVideo});
};

Template.room.helpers({
  isModerator: function() {
    return Session.get('isModerator');
  }
});

Template.room.destroyed = function() {
  var webrtc = RoomManager.getWebRTC();
  webrtc.stopLocalVideo();
  webrtc.leaveRoom();
};

Tracker.autorun(function() {
  if(Session.get('recording')) {
    timeline.init();

    MediaManager.startRecord();

    // insert first event
    if(Session.get('isModerator')) {
      Session.set('activeMediaEventId', Timeline.generateEventId());

      timeline.addEvent({
        id: Session.get('activeMediaEventId'),
        type: 'media',
        toDo: 'insert',
        arg: RoomManager.getLocalStream().id
      });
    };
  };
});

Tracker.autorun(function() {
  if(Session.get('stopping')) {
    MediaManager.stopRecord();

    if(Session.get('isModerator')) {
      // insert last event
      timeline.addEvent({
        id: Session.get('activeMediaEventId'),
        type: 'media',
        toDo: 'remove',
        arg: RoomManager.getLocalStream().id
      });

      // add events to recording
      var recordingId = RoomManager.getRoomRecording().id;
      var events = timeline.getEvents();
      Recordings.update(
        {_id: recordingId},
        {'$set':{events: events}}
      );

      Recordings.update(
        {_id: recordingId},
        {'$set':{duration: events[events.length-1].timestamp}}
      );

      Session.set('stopping', false);
    }
  }
});

// Editor events
Tracker.autorun(function() {
  if(Session.get('editorEvent') && Session.get('recording')) {
    var ev = Session.get('editorEvent');
    timeline.addEvent(ev);

    // reset
    Session.set('editorEvent', undefined);
  }
});

// Media events
Tracker.autorun(function() {
  if(Session.get('mediaEvent') && Session.get('recording')) {
    var ev = Session.get('mediaEvent');
    timeline.addEvent(ev);

    // reset
    Session.set('mediaEvent', undefined);
  }
});

function getLocalPeerData() {
  var usr = Meteor.user().services.google;

  return {
    id: Meteor.user()._id,
    name: usr.name,
    email: usr.email,
    image: usr.picture,
    role: Session.get('isModerator') ? 'moderator' : 'speaker'
  };
};

function formatTime(seconds) {
  minutes = Math.floor(seconds / 60);
  minutes = (minutes >= 10) ? minutes : "0" + minutes;
  seconds = Math.floor(seconds % 60);
  seconds = (seconds >= 10) ? seconds : "0" + seconds;
  return minutes + ":" + seconds;
};
