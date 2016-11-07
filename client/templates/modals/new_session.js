Template.newSession.events({
  'submit': function(event) {
    event.preventDefault();

    var name = $('#room-name').val();
    createRoom(name);

    $('#newSession.modal').modal('hide');
  }
});

function createRoom(name) {
  Meteor.call('createRoom', name, function(err, result) {
    if(err) {
      throwAlert('error', 'Error when create session', 'alert-circle');
    }

    if (result) {
      throwAlert('success', 'Session created successfully', 'checkbox-marked-circle');
    }
  });
};
