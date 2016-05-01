var joinBtn,
    localVideo,
    localStreamstream,
    mediaRecorder,
    recordedBlobs,
    sourceBuffer,
    webrtc;

// Track event constructor
var TrackEvent = function(action, range, val, time) {
  this.action = action;
  this.range = range;
  this.val = val;
  this.timestamp = time;
}

// Tracks Array
var trackEvents = [];

Template.home.rendered = function () {
  Session.set("joined", false);
  Session.set("mode", 'edit');
  Session.set("recording", false);

  joinBtn = document.querySelector('button.btn-js-join');
  localVideo = document.querySelector('video#video-room__local');
}

Template.home.helpers({
  joined: function () {
    return Session.get("joined");
  },
  recording: function () {
    return Session.get("recording");
  }
});

Template.home.events({
  'click .btn-js-join': function (e) {
    showSpinner(localVideo);
    join();
  },
  'click .btn-js-record': function (e) {
    webrtc.sendToAll('rec', {message: 'inforec'});
    record();
    if(Session.get('document')){
      var editor = ace.edit("editor");
      recordEditor(editor);
    }
    Session.set("recording", true);
  },
  'click .btn-js-stop': function (e) {
    webrtc.sendToAll('stop', {message: 'infostop'});
    stop();
    Session.set("recording", false);
    createRecording('recordingTest', SyncUploading)
  }
});

function updateRecording(id, data) {
  var r = Recordings.findOne(id);

  if(r){
    console.log('Update data base');
    Recordings.update({_id: id},{"$push":{videos: {user: Meteor.user().services.google.email, file: data}}});
  }
}

function SyncUploading(id) {
  webrtc.sendToAll('upload', {message: id});

  var blob = newBlob('file-user-1')
  upload(blob, function(fileID) {
    updateRecording(id, fileID);
  });
}

function createRecording(title, callback) {
  var recording = {
    title: title,
    RC: trackEvents // editor events
  };

  Meteor.call('insertRecording', recording, function(err, result){
    if(err){
      console.log("Error when create recording");
    }
    if (result){
      var idRecord = result._id;
      console.log("Recording created ok " + idRecord);
      callback(idRecord);
    }
  });
}

function createRoom(name) {
  var r = {
    name: name,
    participants: []
  }

  Meteor.call('createRoom', r, function(err, result){
    if(err){
      console.log("Error when create room");
    }
    if (result){
      console.log("Room created ok " + result._id);
      Session.set("room", result._id);
      updateRoom(Meteor.user().services.google.email);
    }
  });
}

function updateRoom(user) {
  var roomId = Session.get("room");
  Rooms.update(roomId, { $addToSet: { participants:  user} });
}

function join() {
  var roomName = document.getElementById('room').value;

  var room = Rooms.findOne({name: roomName});

  if (room) {
    Session.set("room", room._id);
    updateRoom(Meteor.user().services.google.email);
  } else {
    createRoom(roomName);
  }

  // create our webrtc connection
  webrtc = new SimpleWebRTC({
    // the id/element dom element that will hold "our" video
    localVideoEl: 'video-room__local',
    // the id/element dom element that will hold remote videos
    remoteVideosEl: '',
    // immediately ask for camera access
    autoRequestMedia: true,
    debug: false,
    detectSpeakingEvents: true,
    autoAdjustMic: false
  });

  // when it's ready, join if we got a room from the URL
  webrtc.on('readyToCall', function () {
    // you can name it anything
    if (roomName) webrtc.joinRoom(roomName);

    Session.set("joined", true);
  });

  // we got access to the camera
  webrtc.on('localStream', function (stream) {
    localStream = stream;
  });
  // we did not get access to the camera
  webrtc.on('localMediaError', function (err) {
  });

  // a peer video has been added
  webrtc.on('videoAdded', function (video, peer) {
    var container = document.createElement('div');
    container.className = 'video-room__participant video-room__participant--active';
    container.id = 'container_' + webrtc.getDomId(peer);
    showSpinner(container);
    container.appendChild(video);
    $('.video-room__participants').append(container);
  });

  // a peer was removed
  webrtc.on('videoRemoved', function (video, peer) {
    console.log('video removed ', peer);
    var remotes = document.getElementsByClassName("video-room__participants");
    var el = document.getElementById('container_' + webrtc.getDomId(peer));
    if (remotes[0] && el) {
      remotes[0].removeChild(el);
    }
  });

  webrtc.connection.on('message', function(message){
    switch(message.type) {
      case 'rec':
        record();
        Session.set("recording", true);
        break;
      case 'stop':
        stop();
        Session.set("recording", false);
        break;
      case 'upload':
        var blob = newBlob('file-user-2');
        upload(blob, function(fileID) {
          var id = message.payload.message;
          updateRecording(id, fileID);
        });
        break;
    }
  });
}

// The nested try blocks will be simplified when Chrome 47 moves to Stable
function record() {
  var options = {mimeType: 'video/webm', bitsPerSecond: 100000};

  recordedBlobs = [];
  try {
    mediaRecorder = new MediaRecorder(localStream, options);
  } catch (e0) {
    console.log('Unable to create MediaRecorder with options Object: ', e0);
    try {
      options = {mimeType: 'video/webm,codecs=vp9', bitsPerSecond: 100000};
      mediaRecorder = new MediaRecorder(localStream, options);
    } catch (e1) {
      console.log('Unable to create MediaRecorder with options Object: ', e1);
      try {
        options = 'video/vp8'; // Chrome 47
        mediaRecorder = new MediaRecorder(localStream, options);
      } catch (e2) {
        alert('MediaRecorder is not supported by this browser.\n\n' +
            'Try Firefox 29 or later, or Chrome 47 or later, with Enable experimental Web Platform features enabled from chrome://flags.');
        console.error('Exception while creating MediaRecorder:', e2);
        return;
      }
    }
  }
  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);

  mediaRecorder.onstop = handleStop;
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start(10); // collect 10ms of data
  console.log('MediaRecorder started', mediaRecorder);
}

function stop() {
  mediaRecorder.stop();
  console.log('Recorded Blobs: ', recordedBlobs);
}

function newBlob(name) {
  var blob = new Blob(recordedBlobs, {
    type: 'video/webm'
  });
  blob.name = name;

  return blob;
}

function handleDataAvailable(event) {
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function handleStop(event) {
  console.log('Recorder stopped: ', event);
}

function upload(file, callback) {
  var uploader = new GDriveUploader({
    file: file,
    token: Meteor.user().services.google.accessToken,
    onComplete: function(data) {
      var jsonResponse = JSON.parse(data);
      fileID = jsonResponse.id
      console.log("Video subido ok " + fileID)

      var participants = Rooms.findOne(Session.get('room')).participants;
      participants.forEach(function(user) {
        if (user !== Meteor.user().services.google.email) {
          insertPermission(fileID, user, 'user', 'reader');
        }
      });

      callback(fileID)
    },
    onError: function(data) {
      console.log('Upload error');
    }
  });

  // Upload video
  uploader.upload();
  console.log('Uploading');
}

function recordEditor(editor) {
  var initTimestamp = localVideo.currentTime;

  editor.getSession().on('change', function(e) {
    var nowTimestamp = localVideo.currentTime;
    var timestamp = nowTimestamp - initTimestamp
    var t = new TrackEvent(e.action, "", "", timestamp);

    switch (e.action){
      case "remove":
        t.range = {
          start: e.start,
          end: e.end
        };
        trackEvents.push(t);
        break;
      case "insert":
        t.range = {
          start: e.start,
          end: e.end
        };
        t.val = e.lines;
        trackEvents.push(t);
        break;
    }
  });
}

function insertPermission(fileId, value, type, role) {
  var xhr = new XMLHttpRequest();
  var url = 'https://www.googleapis.com/drive/v2/files/' + fileId + '/permissions';

  xhr.open('POST', url, true);
  xhr.setRequestHeader('Authorization', 'Bearer ' + Meteor.user().services.google.accessToken);
  xhr.setRequestHeader('Content-Type', 'application/json');

  var body = {
    'value': value,
    'type': type,
    'role': role
  };

  xhr.onload = function(e) {
    console.log('Set permissions ok to ' + value);
  }.bind(this);

  xhr.send(JSON.stringify(body));
}

function showSpinner() {
  for (var i = 0; i < arguments.length; i++) {
    arguments[i].poster = 'transparent-1px.png';
    arguments[i].style.background = "center transparent url('spinner.gif') no-repeat";
  }
}

function hideSpinner() {
  for (var i = 0; i < arguments.length; i++) {
    arguments[i].src = '';
    arguments[i].poster = 'webrtc.png';
    arguments[i].style.background = '';
  }
}
