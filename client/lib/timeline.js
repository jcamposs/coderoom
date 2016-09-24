Timeline = (function () {

  var module = {};

  EventsManager = function() {
    var that = {};

    var $pop = Popcorn("#main-video");

    var initTimestamp = $pop.currentTime();
    var events = [];

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
      events = [];

      that.insertEvent({
        timestamp: 0,
        type: 'session'
      });
    };

    return that;
  }

  module.create = function() {
    var em = EventsManager();

    em.insertEvent({
      timestamp: 0,
      type: 'session'
    });

    return em;
  };

  return module;
}());
