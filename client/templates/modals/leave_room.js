Template.leaveRoom.events({
  'click .btn-js-leave-room': function(e) {
    e.preventDefault();

    $('#leaveRoom.modal').modal('hide');
    Session.set('live', false);
    Session.set('recording', false);
    Session.set('uploading', false);
    MediaManager.pauseMedia();
    Router.go('home');
  }
});

Template.leaveRoom.helpers({
  recording: function() {
    return Session.get('recording');
  },
  uploading: function() {
    return Session.get('uploading');
  }
});
