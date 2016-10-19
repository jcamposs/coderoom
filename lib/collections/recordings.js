Recordings = new Mongo.Collection('recordings');

Meteor.methods ({
  insertRecording: function(title) {
    var optionsDate = {year: 'numeric', month: 'long', day: 'numeric'};

    var r = {
      title: title,
      owner: Meteor.user().profile.name,
      created_on: new Date().toLocaleDateString('en-US', optionsDate)
    };

    var id = Recordings.insert(r);
    console.log("Added recording with id " + id);
    return {_id: id};
  },

  deleteRecording: function(id) {
    Recordings.remove(id);
  }
})
