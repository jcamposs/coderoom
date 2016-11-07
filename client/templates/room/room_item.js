Template.roomItem.events({
  'click .btn-js-invite': function(e) {
    e.preventDefault();

    $('#inviteGuest.modal').attr('data-id', this._id);
    $('#inviteGuest.modal').modal('show');
  }
});
