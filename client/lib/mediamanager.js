MediaManager = (function () {

  var module = {};

  var webrtc = null;
  var localStream;

  var mediaRecorder,
     recordedBlobs;

  function addMessage(msg, remote) {
    var origin = remote ? '' : 'chat__message--right'
    var p = '<div class="chat__message '+origin+'">'
    p += '<div class="chat__message__name">'+msg.name+'</div>'
    p += '<div class="chat__message__content">'
    p += '<div class="chat__message__img">'+'<img src="'+msg.image+'">'+'</div>'
    p += '<div class="chat__message__msg">'+'<div class="chat__message__body">'+msg.value+'</div>'+'</div>'
    p += '</div>'
    p += '</div>'

    $('.chat__container .chat__messages').append(p);

    var scrollValue = $('.chat__container .chat__messages')[0].scrollHeight;
    $('.chat__container').scrollTop(scrollValue);
  }

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
    var blob = generateBlob(RoomManager.getRoomRecording().title);
    var data = {
      file: blob,
      token: Meteor.user().services.google.accessToken
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

    webrtc.on('localStream', function (stream) {
      // if not modrator mute when init
      if(!Session.get('isModerator')){
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
          ace.edit('editor').setReadOnly(true);

          if(Session.get('recording')) {
            Session.set('recording', false);
            Session.set('stopping', true);
          }
          break;
        case 'setSecondaryParticipant':
          var participantId = message.payload.to;
          console.log('Received message: ' + JSON.stringify(message.type) + ' ' + participantId);
          var participants = ParticipantsManager.getParticipants();
          var searchedParticipant = participants[participantId];
          ParticipantsManager.updateSecondaryParticipant(searchedParticipant);

          // If isOnline me
          var sParticipant = ParticipantsManager.getSecondaryParticipant();
          if(localStream.id === participantId && sParticipant != null) {
            webrtc.unmute();
            ace.edit('editor').setReadOnly(false);

            if(message.payload.data.state) {
              Session.set('recording', true);
              Session.set('stopping', false);
              Session.set('activeMediaEventId', message.payload.data.id);
              RoomManager.setRoomRecording(message.payload.data.info);
            }
          }
          break;
        case 'textMessage':
          console.log('Received text message: ' + JSON.stringify(message.type));
          addMessage(message.payload, true);
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

  module.sendTextMessage = function(value) {
    var user = RoomManager.getLocalUser();
    var msg =  {
      name: user.name,
      image: user.image,
      value: value
    };

    addMessage(msg);

    this.sendToAllMessage('textMessage', msg);
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
    if(mediaRecorder) {
      mediaRecorder.stop();
      console.log('Recorded Blobs: ', recordedBlobs);
    }
  };

  return module;

}());
