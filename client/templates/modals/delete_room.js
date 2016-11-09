Template.deleteRoom.events({
  'click .btn-js-delete-room': function(e) {
    e.preventDefault();

    var idRoom= $("#deleteRoom.modal").attr('data-id');

    Meteor.call('removeRoom', idRoom, function(err) {
      if(err) {
        throwAlert('error', 'Error when delete room', 'alert-circle');
      }
      throwAlert('success', 'Room deleted successfully', 'checkbox-marked-circle');
      $('.modal').modal('hide');
    });
  }
});
