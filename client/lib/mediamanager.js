MediaManager = (function () {

  var module = {};

  var webrtc = null;
  var localStream;

  var mediaRecorder,
     recordedBlobs,
     sourceBuffer;

  function generateBlob(name) {
    var blob = new Blob(recordedBlobs, {
      type: 'video/webm'
    });
    blob.name = name;

    return blob;
  };

  function handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
      recordedBlobs.push(event.data);
    };
  };

  function handleStop(event) {
    console.log('Recorder stopped: ', event);
    var blob = generateBlob('test23sep');
    var data = {
      file: blob,
      token: RoomManager.getLocalUser().token
    };

    UploaderManager.upload(data);
  };

  function onError(event) {
    console.log('Recorder error: ', event);
  };

  function addMediaListeners() {
    webrtc.on('readyToCall', function () {
      var room = this.config.room;

      if (room) webrtc.joinRoom(room);
    });

    webrtc.on('localStream', function (stream, p) {
      // if not admin mute when init
      if(RoomManager.getLocalUser().role != 'admin'){
         this.mute();
      }
      RoomManager.setLocalStream(stream);
      localStream = stream;

      var conf = {
        stream: stream,
        profile: this.config.nick,
        remote: false
      };
      ParticipantsManager.addLocalParticipant(conf);
    });

    webrtc.on('videoAdded', function (video, peer) {
      var conf = {
        stream: peer.stream,
        profile: peer.nick,
        remote: true
      };
      ParticipantsManager.addParticipant(conf);
    });

    webrtc.on('videoRemoved', function (video, peer) {
      ParticipantsManager.removeParticipantByStream(peer.stream);
    });

    webrtc.connection.on('message', function(message){
      switch(message.type) {
        case 'muteMedia':
          console.log('Received message: ' + JSON.stringify(message.type));
          webrtc.mute();

          // Stop if recording and upload record
          if(Session.get('recording')) {
            console.log('stop')
            Session.set('recording', false);
            Session.set('upload', true);
          }
          break;
        case 'setSecondaryParticipant':
          var participantId = message.payload.id;
          console.log('Received message: ' + JSON.stringify(message.type) + ' ' + participantId);
          var participants = ParticipantsManager.getParticipants();
          var searchedParticipant = participants[participantId];
          ParticipantsManager.updateSecondaryParticipant(searchedParticipant);

          // If isOnline me
          if(RoomManager.getLocalStream().id == participantId) {
            webrtc.unmute();

            if(message.payload.recording) {
              Session.set('recording', true);
              // Session.set('upload', false);
            }
          }
          break;
      }
    });
  };

  module.connect = function(options) {
    // create webrtc connection
    webrtc = new SimpleWebRTC(options);

    addMediaListeners();

    return webrtc;
  };

  module.sendToAllMessage = function(type, msg) {
    webrtc.sendToAll(type, msg);
  };

  module.startRecord = function() {
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
    mediaRecorder.onerror = onError;
    mediaRecorder.start(10); // collect 10ms of data
    console.log('MediaRecorder started', mediaRecorder);
  };

  module.stopRecord = function() {
    mediaRecorder.stop();
    console.log('Recorded Blobs: ', recordedBlobs);
  };

  return module;

}());
