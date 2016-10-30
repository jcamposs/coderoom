Template.roomControls.helpers({
  live: function () {
    return Session.get('live');
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
  }
});
