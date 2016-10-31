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
      console.log('Error when create room');
    }

    if (result) {
      console.log('Room created ok ' + result);
      throwAlert('success', 'Session created successfully', 'checkbox-marked-circle');
    }
  });
};
