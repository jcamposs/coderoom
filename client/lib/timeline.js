Timeline = (function () {

  var module = {};

  var $pop;

  EventsManager = function() {
    var that = {};

    var initTimestamp;
    var events;

    that.init = function() {
      initTimestamp = $pop.currentTime();
      events = [];
    };

    that.insertEvent  = function(evt) {
      events.push(evt);
    };

    that.getEvents = function() {
      return events;
    };

    that.getCurrentTime = function() {
      return $pop.currentTime() - initTimestamp;
    };

    return that;
  }

  module.create = function() {
    var tl = EventsManager();
    tl.init();

    tl.insertEvent({
      timestamp: 0,
      type: 'session'
    });

    return tl;
  };

  module.useTimebar = function(widget) {
    $pop = widget;
  };

  return module;
}());
