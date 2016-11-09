Template.deleteRecording.events({
  'click .btn-js-delete-rec': function(e) {
    e.preventDefault();

    var idRecording = $("#deleteRecording.modal").attr('data-id');

    Meteor.call('deleteRecording', idRecording, function(err) {
      if(err) {
        throwAlert('error', 'Error when delete recording', 'alert-circle');
      }
      throwAlert('success', 'Recording deleted successfully', 'checkbox-marked-circle');
      $('.modal').modal('hide');
    });
  }
});
