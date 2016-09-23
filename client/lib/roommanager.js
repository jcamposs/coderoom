RoomManager = (function () {

  var module = {};

  var webRTC;
  var roomName;
  var localStream;
  var localUser;

  module.getWebRTC = function() {
    return webRTC;
  };

  module.getRoomName = function() {
    return roomName;
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

  module.setRoomName = function (value) {
    roomName = value;
  };

  module.setLocalStream = function (value) {
    localStream = value;
  };

  module.setLocalUser = function (value) {
    localUser = value;
  };

  return module;

}());
