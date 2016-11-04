Template.shareLink.helpers({
  users: function() {
    return Meteor.users.find({_id: {$ne: Meteor.userId()}});
  }
});

Template.shareLink.events({
'click .btn-js-send': function(e) {
  e.preventDefault();

  var room = Rooms.findOne({_id: $("#shareLink.modal").attr('data-id')});

  $('input:checkbox:checked').each(function(){
    var receiver = $(this).val();
    var sender = Meteor.user().profile.name;

    var ntf = {
      receiver: receiver,
      sender: sender,
      img: Meteor.user().services.google.picture,
      urlToContent: room._id,
      content: sender + ' wants you to join the room ' + room.name
    };

    Meteor.call('createNotification', ntf, function(err) {
      if(err) {
        throwAlert('error', 'Error when share link', 'alert-circle');
      }
    });
  });

  $('.modal').modal('hide');
 }
});
