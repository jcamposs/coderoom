MediaManager = (function () {

  var module = {};

  MediaIface = function() {
    var that = {};

    var room;
    var webrtc;
    var localStream;

    var mediaRecorder,
       recordedBlobs,
       sourceBuffer;

    function handleDataAvailable(event) {
      if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
      }
    }

    function handleStop(event) {
      console.log('Recorder stopped: ', event);
    }

    function onError(event) {
      console.log('Recorder error: ', event);
    }

    function addLocalVideo(stream) {
      $('#video-room__local').attr('src', window.URL.createObjectURL(stream));
    };

    function addParticipant(id, name, img) {
      var p = '<div id="' + id + '" class="room__participant room_participant-js">'
      p += '<i class="mdi mdi-checkbox-blank-circle"></i>'
      p += '<img class="room__participant__image__profile" src="' + img + '">'
      p += '<div class="room__participant__name">' + name + '</div>'
      p += '</div>';

      $('.room__participants').append(p);
    }

    function updateSecondaryParticipant(stream) {
      var p = '<div class="room__chat__participant room__chat__participant--active">'
      p += '<video src="' + stream + '" muted autoplay></video>'
      p += '</div>';

      $('.room__chat__participants').append(p);
    }

    function removeSecondaryParticipant() {
      $('.room__chat__participants').find('.room__chat__participant').remove();
    }

    function addListeners() {
      webrtc.on('readyToCall', function () {
        if (room) webrtc.joinRoom(room);
      });

      webrtc.on('localStream', function (stream) {
        localStream = stream;

        var participant = {
          id: stream.id,
          profile: Meteor.user().services.google
        }

        Room.addParticipant(room, participant);
        addLocalVideo(stream);
      });

      webrtc.on('videoAdded', function (participantEl, peer) {
        var participant = Room.getParticipant(room, peer.stream.id);
        participant.src = participantEl.src;
        Room.updateParticipant(room, participant);
        addParticipant(participant.id, participant.profile.name, participant.profile.picture);
      });

      webrtc.on('videoRemoved', function (participantEl, peer) {
        Room.removeParticipant(room, peer.stream.id)
        $('#' + peer.stream.id).remove();
      });

      webrtc.connection.on('message', function(message){
        switch(message.type) {
          case 'muteAll':
            console.log('Received message: ' + message.type);
            webrtc.mute();

            // Remove active participant
            $('.room__participants').find('.room__participant').removeClass('room__participant--active');
            removeSecondaryParticipant();

            // Stop if recording and upload record
            if(Session.get('recording')) {
              Session.set('recording', false);
              Session.set('upload', true);
            }

            break;
          case 'isOnline':
            var participantId = message.payload.message;

            console.log('Received message: ' + message.type + ' participant ' + participantId);

            $('#' + participantId).addClass('room__participant--active');
            var participant = Room.getParticipant(room, participantId);
            updateSecondaryParticipant(participant.src)
            break;
        }
      });

      webrtc.on('channelMessage', function (peer, to, data) {
        // Only handle messages from your dataChannel
        var me = $(this)[0].webrtc.localStreams[0].id;
        if (me == to) {
          console.log('Received message: ' + JSON.stringify(data.type) + ' from ' + peer.id);

          webrtc.unmute();
          webrtc.sendToAll('isOnline', {message: me});

          if(data.payload.recording) {
            Session.set('recording', true);
            Session.set('upload', false);
          }
        }
      });
    };

    that.connectUserMedia = function() {
      var options = {
        // the id/element dom element that will hold "our" video
        localVideoEl: '',
        // the id/element dom element that will hold remote videos
        remoteVideosEl: '',
        // immediately ask for camera access
        autoRequestMedia: true,
        enableDataChannels: true
      }

      // create our webrtc connection
      webrtc = new SimpleWebRTC(options);

      addListeners();
    };

    that.connectToRoom = function(roomId) {
      room = roomId;
    };

    that.setParticipantOnline = function(participantEl) {
      webrtc.sendToAll('muteAll');
      console.log('Send muteAll');

      // Remove all active participants
      $('.room__participants').find('.room__participant').not(participantEl).removeClass('room__participant--active');
      removeSecondaryParticipant();

      // Toggle state current participant
      if (participantEl.hasClass('room__participant--active')) {
        participantEl.removeClass('room__participant--active');
      } else {
        // Send to peer to mute
        setTimeout(function(){
          var to = participantEl.attr('id');
          var msg = {"recording": Session.get("recording")};

          webrtc.sendDirectlyToAll(to, 'setOnline', msg);
          console.log('Send setOnline to ' + to)
        }, 1000);
      }
    };
    // Function to record media stream
    that.recordMedia = function() {
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

    that.stopRecordMedia = function() {
      mediaRecorder.stop();
      console.log('Recorded Blobs: ', recordedBlobs);
    };

    return that;
  }

  module.initUserMedia = function(roomId) {
    iface = MediaIface();
    iface.connectToRoom(roomId);
    iface.connectUserMedia();

    return iface
  };

  return module;

}());
