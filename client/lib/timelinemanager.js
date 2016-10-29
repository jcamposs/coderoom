Timeline = (function () {

  var module = {};

  var events = [];

  var mediaEl;
  var initTimestamp;

  module.addEvent = function(value) {
    value.timestamp = this.getCurrentTime();
    events.push(value);
  };

  module.getCurrentTime = function() {
    return mediaEl.currentTime - initTimestamp;
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
