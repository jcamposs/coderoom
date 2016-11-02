Timeline = (function () {

  var module = {};

  var events = [];

  var mediaEl;
  var initTimestamp;

  function getCurrentTime() {
    return mediaEl.currentTime - initTimestamp;
  };

  module.addEvent = function(value) {
    value.timestamp = getCurrentTime();
    events.push(value);
  };

  module.init = function(conf) {
    mediaEl = conf.mediaEl;
    initTimestamp = mediaEl.currentTime;
    events = [];
  };

  module.generateEventId = function() {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  module.getEvents = function() {
    return events;
  };

  return module;

}());
