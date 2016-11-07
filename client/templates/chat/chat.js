Template.chat.helpers({
  isEdition: function() {
    return Session.get('isEdition');
  }
});

Template.chat.events({
  'click .btn-js-send-msg': function() {
    var msg = $('.chat__input__text textarea').val();
    if(msg) {
      MediaManager.sendTextMessage(msg, false);
      $('.chat__input__text textarea').val('');
    }
  },
  'keypress .chat__input__text textarea': function(event) {
    if (event.keyCode === 13) {
      var msg = event.target.value;
      if(msg) {
        MediaManager.sendTextMessage(msg, false);
        event.stopPropagation();
        event.target.value = '';
      }
      return false;
    }
  }
});
