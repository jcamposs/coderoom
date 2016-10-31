Template.finishedBroadcast.events({
  'click .btn-js-finished-live': function(e) {
    e.preventDefault();

    Router.go('home');
    Session.set('live', false);
    MediaManager.pauseMedia();
    $('#finishedBroadcast.modal').modal('hide');
  }
});
