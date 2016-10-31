RoomManager = (function () {

  var module = {};

  var config;
  var webRTC;
  var roomRecording;
  var localStream;

  module.getRoomConfig = function() {
    return config;
  };

  module.getWebRTC = function() {
    return webRTC;
  };

  module.getRoomRecording = function() {
    return roomRecording;
  };

  module.getLocalStream = function () {
    return localStream;
  };

  module.setRoomConfig = function(value) {
    config = value;
  };

  module.setWebRTC = function(value) {
    webRTC = value;
  };

  module.setRoomRecording = function (value) {
    roomRecording = value;
  };

  module.setLocalStream = function (value) {
    localStream = value;
  };

  return module;

}());
