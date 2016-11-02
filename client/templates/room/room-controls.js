Template.roomControls.helpers({
  isEdition: function() {
    return Session.get('isEdition');
  },
  isPlayback: function() {
    return Session.get('isPlayback');
  },
  isModerator: function() {
    return Session.get('isModerator');
  },
  live: function () {
    return Session.get('live');
  }
});

Template.roomControls.events({
  'click .btn-js-start-live': function() {
    MediaManager.resumeMedia();
  },

  'click .btn-js-stop-live': function() {
    $('#stopBroadcast.modal').modal('show');
  },

  'click .btn-js-leave-room': function() {
    $('#leaveRoom.modal').modal('show');
  }
});
