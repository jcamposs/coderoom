Template.recordingItem.events({
  'click .btn-js-delete-recording': function() {
    Meteor.call('deleteRecording', this._id, function(err) {
      if(err) {
        throwAlert('error', 'Error when delete recording', 'alert-circle');
      }
    });
  }
});
