Rooms = new Mongo.Collection ('rooms');

Meteor.methods ({
  createRoom: function(name){
    var optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };

    var roomId = Rooms.insert({
      'name': name,
      'owner': Meteor.user()._id,
      'created_on': new Date().toLocaleDateString('en-US', optionsDate)
    });

    console.log("Create room " + name);

    return roomId;
  },
  removeRoom: function(id) {
    Rooms.remove(id);
  }
});
