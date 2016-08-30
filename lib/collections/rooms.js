Rooms = new Mongo.Collection ('rooms');

Meteor.methods ({
  createRoom: function(name){
    var roomId = Rooms.insert({
      'name': name,
      'participants': [],
      'timeline': []
    });

    console.log("Create room " + name);

    return roomId;
  },
  removeRoom: function(id) {
    Rooms.remove(id);
  }
})
