Template.newRecording.events({
  'submit': function(event) {
    event.preventDefault();

    var target = event.target;
    var name = target.text.value;
    var editorMode = Session.get('editorMode').module;

    $('.modal').modal('hide');

    createRecording(name, editorMode);
  }
});

function createRecording(title, mode) {
  Meteor.call('insertRecording', title, mode, function(err, result) {
    if(err) {
      throwAlert('error', 'Error when create recording', 'alert-circle');
    }

    if (result) {
      RoomManager.setRoomRecording({id: result, title: title});
      Session.set('recording', true);
    }
  });
};
