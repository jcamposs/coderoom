Meteor.publish("userData", function () {
  return Meteor.users.find({_id: this.userId}, {fields: {'services': 1}});
});

Meteor.publish('recordings', function() {
   return Recordings.find({});
});
