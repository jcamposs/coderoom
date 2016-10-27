Template.chat.events({
  'keypress .chat__input__text textarea': function(event) {
    if (event.keyCode === 13) {
      var msg = event.target.value;
      MediaManager.sendTextMessage(msg, false);
      event.stopPropagation();
      event.target.value = '';
      return false;
    }
  }
});
