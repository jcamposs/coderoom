function getLocalPeerData() {
  var usr = Meteor.user().services.google;

  return {
    name: usr.name,
    email: usr.email,
    image: usr.picture,
    role: Session.get('isModerator') ? 'moderator' : 'speaker',
    token: usr.accessToken
  };
};

function addEvent(ev) {
  var nowTimestamp = mainVideo.currentTime;
  ev.timestamp = nowTimestamp - initTimestamp;
  timeline.push(ev);
};

function formatTime(seconds) {
  minutes = Math.floor(seconds / 60);
  minutes = (minutes >= 10) ? minutes : "0" + minutes;
  seconds = Math.floor(seconds % 60);
  seconds = (seconds >= 10) ? seconds : "0" + seconds;
  return minutes + ":" + seconds;
};

function makeId() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 5; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};

var timeline = [];
var mainVideo;
var initTimestamp;

Template.room.created = function() {
  setTimeout(function(){
    Session.set('loading', false);
  }, 4000);

  var defaultDoc = this.data;
  var sessionRole = Router.current().params.query.role

  Session.set('document', defaultDoc);
  Session.set('isModerator', sessionRole == 'moderator')
}

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
  'keypress textarea': function(event) {
    if (event.keyCode == 13) {
      var msg = event.target.value;
      MediaManager.sendTextMessage(msg, false);
      event.stopPropagation();
      event.target.value = '';
      return false;
    }
  }
});

Template.room.rendered = function() {
  var roomId = this.data;
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
  RoomManager.setRoomName(roomId);
  RoomManager.setLocalUser(localPeerData);


  var editor = ace.edit('editor');
  setTimeout(function(){
    if(Session.get('isModerator')) {
      editor.setReadOnly(false);
    }
    editor.setValue('');
  }, 3000);

  mainVideo = document.getElementById('main-video');
  mainVideo.addEventListener('timeupdate',function(){
    var time = 0;
    if(Session.get('recording')) {
      var nowTimestamp = this.currentTime;
      time = nowTimestamp - initTimestamp;
    }
    $(".room__controls__current-time").text(formatTime(time));
  }, false);
};

Tracker.autorun(function() {
  if(Session.get('recording')) {
    initTimestamp = mainVideo.currentTime;

    MediaManager.startRecord();

    // insert first event
    if(Session.get('isModerator')) {
      var currentEventId = makeId();
      Session.set('currentEventId', currentEventId);

      addEvent({
        id: Session.get('currentEventId'),
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
      addEvent({
        id: Session.get('currentEventId'),
        type: 'media',
        toDo: 'remove',
        arg: RoomManager.getLocalStream().id
      });

      // add events to recording
      var recordingId = Session.get('recordingData').id;
      Recordings.update(
        {_id: recordingId},
        {'$set':{events: timeline}}
      );

      // Reset
      timeline = [];
      initTimestamp = 0;

      Session.set('stopping', false);
    }
  }
});

// Editor events
Tracker.autorun(function() {
  if(Session.get('editorEvent')) {
    if(Session.get('recording')) {
      var ev = Session.get('editorEvent');
      addEvent(ev);

      // reset
      Session.set('editorEvent', undefined);
    }
  }
});

// Media events
Tracker.autorun(function() {
  if(Session.get('participantEvent')) {
    if(Session.get('recording')) {
      var ev = Session.get('participantEvent');
      addEvent(ev);

      // reset
      Session.set('participantEvent', undefined);
    }
  }
});
