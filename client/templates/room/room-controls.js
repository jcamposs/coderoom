Template.roomControls.helpers({
  live: function () {
    return Session.get('live');
  },
  recording: function () {
    return Session.get('recording');
  }
});

Template.roomControls.events({
  'click .btn-js-start-live': function() {
    Session.set('live', true);
    MediaManager.resumeMedia();
  },

  'click .btn-js-stop-live': function() {
    Session.set('live', false);
    MediaManager.pauseMedia();
  },

  'click .btn-js-stop': function() {
    Session.set('recording', false);
    Session.set('stopping', true);
  }
});
