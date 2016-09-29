Template.roomControlsBar.rendered = function() {
  Session.set('recording', false);
  Session.set('upload', false);
};

Template.roomControlsBar.helpers({
  recording: function () {
    return Session.get('recording');
  },
});

Template.roomControlsBar.events({
  'click .btn-js-record': function (e) {
    Session.set('recording', true);
    Session.set('upload', false);
  },

  'click .btn-js-stop': function (e) {
    Session.set('recording', false);
    Session.set('upload', true);
  },
});
