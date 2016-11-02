Template.stopBroadcast.events({
  'click .btn-js-stop-live': function(e) {
    e.preventDefault();

    var configRoom = RoomManager.getRoomConfig();
    Meteor.call('removeRoom', configRoom._id, function(err, result) {
      if(err) {
        throwAlert('error', 'Error ending the session', 'alert-circle');
      }
      MediaManager.sendToAllMessage('finishedSession');
      $('#stopBroadcast.modal').modal('hide');
      Session.set('live', false);
      Session.set('recording', false);
      Session.set('uploading', false);
      MediaManager.pauseMedia();
      Router.go('home');
    });
  }
});

Template.stopBroadcast.helpers({
  recording: function() {
    return Session.get('recording');
  },
  uploading: function() {
    return Session.get('uploading');
  }
});
