Recordings = new Mongo.Collection('recordings');

Meteor.methods ({
  insertRecording: function(title) {
    var optionsDate = {year: 'numeric', month: 'long', day: 'numeric'};

    var recordingId = Recordings.insert({
      title: title,
      owner: Meteor.user().profile.name,
      createdAt: new Date().toLocaleDateString('en-US', optionsDate),
      sources: [],
      duration: 0,
      state: 'live'
    });

    return recordingId;
  },

  deleteRecording: function(id) {
    Recordings.remove(id);
  }
});
