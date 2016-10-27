RoomManager = (function () {

  var module = {};

  var webRTC;
  var roomRecording;
  var localStream;
  var localUser;
  var timeline;

  module.getWebRTC = function() {
    return webRTC;
  };

  module.getRoomRecording = function() {
    return roomRecording;
  };

  module.getLocalStream = function () {
    return localStream;
  };

  module.getLocalUser = function () {
    return localUser;
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

  module.setLocalUser = function (value) {
    localUser = value;
  };

  return module;

}());