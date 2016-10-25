Template.modalNewSession.events({
  'click .btn-js-save': function(e) {
    e.preventDefault();

    var name = $('#room-name').val();
    createRoom(name);

    $('.modal').modal('hide');
  }
});

function createRoom(name) {
  Meteor.call('createRoom', name, function(err, result) {
    if(err) {
      console.log('Error when create room');
    }

    if (result) {
      console.log('Room created ok ' + result);
    }
  });
};
