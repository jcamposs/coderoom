Template.modal.rendered = function() {
  Session.set('recordingData', {});
};

Template.modal.events({
  'submit': function(event, template) {
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
      Session.set('recordingData', {id: recordingId, title: title});
      console.log('Recording created ok ' + recordingId);
      Session.set('recording', true);
    }
  });
};
