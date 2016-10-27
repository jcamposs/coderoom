Template.newRecordingModal.events({
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
      console.log('Error when create recording');
    }

    if (result) {
      var recordingId = result._id;
      console.log('Recording created ok ' + recordingId);
      RoomManager.setRoomRecording({id: recordingId, title: title});
      Session.set('recording', true);
    }
  });
};
