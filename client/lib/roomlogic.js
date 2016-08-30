Room = (function () {

  var module = {};

  function participantInRoom(roomId, participantId) {
    var participants = module.getAllParticipants(roomId);
    return participants.filter(function(p) { return p.id === participantId; }).length > 0;
  };

  function searchParticipant(roomId, participantId) {
    var participants = module.getAllParticipants(roomId);
    return participants.findIndex(function(p) {return p.id === participantId; });
  }

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

  module.addParticipant = function(roomId, participant) {
    if(!participantInRoom(roomId, participant.id)) {
      Rooms.update( {_id: roomId}, {$push: {participants: participant} } );
      console.log('Added participant ' + participant.id + ' in room ' + roomId);
    }
  };

  module.removeParticipant = function(roomId, participantId) {
    var participant = searchParticipant(roomId, participantId);

    var participants = module.getAllParticipants(roomId);
    participants.splice(participant, 1)

    Rooms.update({_id: roomId }, {$set:{"participants": participants}});
    console.log('Removed participant ' + participantId + 'in room ' + roomId);
  };

  module.getAllParticipants = function(roomId) {
    var participants = Rooms.findOne({_id: roomId}, {participants: 1, _id: 0} ).participants;
    return participants;
  };

  module.getParticipant = function(roomId, participantId) {
    var participants = this.getAllParticipants(roomId);
    return participants.filter(function(p) { return p.id === participantId; })[0];
  };

  module.updateParticipant = function(roomId, participant) {
    var participants = this.getAllParticipants(roomId);
    var participantsParsed = participants.filter(function(p) {return p.id !== participant.id;});

    participantsParsed.push(participant);

    Rooms.update({_id: roomId}, {$set:{"participants": participantsParsed}});
  };



  return module;

}());
