Rooms = new Mongo.Collection ('rooms');

Meteor.methods ({
  createRoom: function(r){
    var id = Rooms.insert(r);
    console.log("Added room with id " + id);
    return {_id: id};
  },
  removeRoom: function(id) {
    Rooms.remove(id);
  }
})
