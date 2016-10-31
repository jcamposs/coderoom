Template.stopBroadcast.events({
  'click .btn-js-stop-live': function(e) {
    e.preventDefault();

    var configRoom = RoomManager.getRoomConfig();
    Meteor.call('removeRoom', configRoom._id, function(err, result) {
      if(err) {
        console.log('Error when remove room');
      }
      MediaManager.sendToAllMessage('finished-session');
      $('#stopBroadcast.modal').modal('hide');
      Session.set('live', false);
      MediaManager.pauseMedia();
      Router.go('home');
    });
  }
});

Template.stopBroadcast.helpers({
  recording: function() {
    return Session.get('recording');
  }
});
