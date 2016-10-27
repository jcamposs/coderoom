Timeline = (function () {

  var module = {};

  EventsManager = function(conf) {
    var that = {};

    var mediaEl = conf.mediaEl;

    var initTimestamp;
    var events;

    that.addEvent = function(value) {
      value.timestamp = that.getCurrentTime();
      events.push(value);
    };

    that.getEvents = function() {
      return events;
    };

    that.getCurrentTime = function() {
      return mediaEl.currentTime - initTimestamp;
    };

    that.init = function() {
      initTimestamp = mediaEl.currentTime;
      events = [];
    };

    return that;
  };

  module.generateEventId = function() {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  module.create = function(conf) {
    return EventsManager(conf);
  };

  return module;
}());
