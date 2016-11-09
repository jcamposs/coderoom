Template.roomItem.events({
  'click .btn-js-invite': function(e) {
    e.preventDefault();

    $('#inviteGuest.modal').attr('data-id', this._id);
    $('#inviteGuest.modal').modal('show');
  },
  'click .btn-js-delete-room': function(e) {
    e.preventDefault();

    var r = Rooms.findOne({_id: this._id});

    $('#deleteRoom.modal').attr('data-id', this._id);

    var content = 'Are you sure delete '+ r.name + '?';
    $('#deleteRoom.modal .modal__text').html(content);

    $('#deleteRoom.modal').modal('show');
  }
});
