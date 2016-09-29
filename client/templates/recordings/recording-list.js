Template.recordingsList.created = function() {
  Session.set('loading', true);
}

Template.recordingsList.rendered = function() {
  Session.set('loading', false);
}

Template.recordingsList.helpers({
  recordings: function () {
    return Recordings.find();
  }
});
