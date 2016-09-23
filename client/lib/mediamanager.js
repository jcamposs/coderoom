MediaManager = (function () {

  var module = {};

  var webrtc = null;

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

      var conf = {
        stream: stream,
        profile: this.config.nick
      };
      ParticipantsManager.addLocalParticipant(conf);
    });

    webrtc.on('videoAdded', function (video, peer) {
      var conf = {
        stream: peer.stream,
        profile: peer.nick
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
          break;
        case 'setMainParticipant':
          var participantId = message.payload.id;
          console.log('Received message: ' + JSON.stringify(message.type) + ' ' + participantId);
          var participants = ParticipantsManager.getParticipants();
          var searchedParticipant = participants[participantId];
          ParticipantsManager.updateMainParticipant(searchedParticipant);

          if(RoomManager.getLocalStream().id == participantId) {
            webrtc.unmute();
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

  return module;

}());
