Timeline = (function () {

  var module = {};

  EventsManager = function() {
    var that = {};

    var $pop = Popcorn("#main-video");

    var initTimestamp;
    var events;

    that.insertEvent  = function(value) {
      events.push(value);
    };

    that.getEvents = function() {
      return events;
    };

    that.getCurrentTime = function() {
      return $pop.currentTime() - initTimestamp;
    };

    that.clear = function() {
      initTimestamp = $pop.currentTime();
      events = [];
    };

    return that;
  }

  module.create = function() {
    var em = EventsManager();

    return em;
  };

  return module;
}());
