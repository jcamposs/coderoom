Recordings = new Mongo.Collection ('recordings');

Meteor.methods ({
  insertRecording: function(r){
    var id = Recordings.insert(r);
    console.log("Added recording with id " + id);
    return {_id: id};
  },
  deleteRecording: function(id) {
    Recordings.remove(id);
  }
})
