MediaManager = (function () {

  var module = {};

  var localStream;
  var roomId;

  MediaIface = function() {
    var that = {};

    var room;
    var webrtc;
    var localStream;

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
        var user = Meteor.user();
        user.media = {
          streamId: stream.id
        };
        Room.addUser(room, user);
        addLocalVideo(stream);
      });

      webrtc.on('videoAdded', function (participant, peer) {
        console.log(peer.stream.id)
        console.log(Room.getAllParticipants(room))
        var user = Room.getParticipant(room, peer.stream.id);
        user.media.src = participant.src;

        addParticipant(user.media.streamId, user.profile.name, user.services.google.picture);

        Room.updateUser(room, user);
      });

      webrtc.on('videoRemoved', function (participant, peer) {
        Room.removeUser(room, peer.stream.id);
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

            break;
          case 'isOnline':
            var userId = message.payload.message;

            console.log('Received message: ' + message.type + ' user ' + userId);

            $('#' + userId).addClass('room__participant--active');
            var user = Room.getParticipant(room, userId);
            console.log(user)
            updateSecondaryParticipant(user.media.src)
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

    that.connectToRoom = function(name) {
      room = name;
    };

    that.setUserOnline = function(user) {
      webrtc.sendToAll('muteAll');
      console.log('Send muteAll');

      // Remove all active participants
      $('.room__participants').find('.room__participant').not(user).removeClass('room__participant--active');
      removeSecondaryParticipant();

      // Toggle state current participant
      if (user.hasClass('room__participant--active')) {
        user.removeClass('room__participant--active');
      } else {
        // Send to peer to mute
        setTimeout(function(){
          webrtc.sendDirectlyToAll(user.attr('id'), 'setOnline');
          console.log('Send setOnline to ' + user.attr('id'))
        }, 1000);
      }
    };

    return that;
  }

  module.initUserMedia = function(room) {
    iface = MediaIface();
    iface.connectToRoom(room);
    iface.connectUserMedia();

    return iface
  };

  return module;

}());
