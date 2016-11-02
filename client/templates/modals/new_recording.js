Template.newRecording.events({
  'submit': function(event) {
    event.preventDefault();

    var target = event.target;
    var name = target.text.value;

    $('.modal').modal('hide');

    createRecording(name);
  }
});

function createRecording(title) {
  Meteor.call('insertRecording', title, function(err, result) {
    if(err) {
      throwAlert('error', 'Error when create recording', 'alert-circle');
    }

    if (result) {
      var recordingId = result._id;
      RoomManager.setRoomRecording({id: recordingId, title: title});
      Session.set('recording', true);
    }
  });
};
