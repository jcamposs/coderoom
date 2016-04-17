Template.recordingsList.helpers({
  recordings: function () {
    return Recordings.find();
  }
});
