Template.roomControls.rendered = function() {
  Session.set('recording', false);
  Session.set('stopping', false);
};

Template.roomControls.helpers({
  recording: function () {
    return Session.get('recording');
  },
});

Template.roomControls.events({
  'click .btn-js-stop': function (e) {
    Session.set('recording', false);
    Session.set('stopping', true);
  },
});
