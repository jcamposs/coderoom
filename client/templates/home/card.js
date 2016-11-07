Template.card.events({
  'click .btn-js-share': function(e) {
    e.preventDefault();

    $("#shareLink.modal").attr('data-id', this._id);
    $('#shareLink.modal').modal('show');
  }
});
