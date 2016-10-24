Meteor.publish("userData", function () {
  return Meteor.users.find({_id: this.userId}, {fields: {'services': 1}});
});

Meteor.publish('rooms', function() {
   return Rooms.find({});
});

Meteor.publish('recordings', function() {
  return Recordings.find({
    participants : { $elemMatch: {
      id: this.userId
    }}
  });
});

Meteor.publish('documents', function() {
   return Documents.find({});
});
