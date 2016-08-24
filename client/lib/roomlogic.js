Room = (function () {

  var module = {};

  function userInRoom(roomId, user) {
    var users = module.getAllParticipants(roomId);
    return users.filter(function(e) { return e._id == user._id; }).length > 0;
  };

  module.create = function(name, callback) {
    Meteor.call('createRoom', name, function(err, res){
      if (err) {
        console.log("Error when create room");
      }
      if (res) {
        callback(res);
      }
    });
  };

  module.addUser = function(roomId, user) {
    Rooms.update( {_id: roomId }, {$push: {users: user} } );
  };

  module.getAllParticipants = function(roomId) {
    console.log(Rooms.findOne({_id: roomId}, {users: 1, _id: 0} ))
    var users = Rooms.findOne({_id: roomId}, {users: 1, _id: 0} ).users;
    return users;
  };

  module.getParticipant = function(roomId, streamId) {
    var users = this.getAllParticipants(roomId);
    return users.filter(function(e) { return e.media.streamId == streamId; })[0]
  };

  module.updateUser = function(roomId, user) {
    var users = this.getAllParticipants(roomId);
    var usersAux = users.filter(function(e) {return e.media.streamId !== user.media.streamId; });

    usersAux.push(user);

    Rooms.update({_id: roomId }, {$set:{"users": usersAux}});
  };

  module.removeUser = function(roomId, peerId) {
    var users = this.getAllParticipants(roomId);
    var index = users.findIndex(function(e) {return e.media.streamId === peerId; });

    users.splice(index, 1)

    Rooms.update({_id: roomId }, {$set:{"users": users}});
  };

  return module;

}());
