Template.roomControlsBar.rendered = function() {
  Session.set('recording', false);
  Session.set('stopping', false);
};

Template.roomControlsBar.helpers({
  recording: function () {
    return Session.get('recording');
  },
});

Template.roomControlsBar.events({
  'click .btn-js-stop': function (e) {
    Session.set('recording', false);
    Session.set('stopping', true);
  },
});
