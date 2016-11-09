Template.recordingItem.helpers({
  isDashboardPage: function() {
    return Session.get('dashboardPage');
  }
});

Template.recordingItem.events({
  'click .btn-js-delete-recording': function(e) {
    e.preventDefault();

    var r = Recordings.findOne({_id: this._id});

    $('#deleteRecording.modal').attr('data-id', this._id);

    var content = 'Are you sure delete '+ r.title + '?';
    $('#deleteRecording.modal .modal__text').html(content);

    $('#deleteRecording.modal').modal('show');
  }
});
