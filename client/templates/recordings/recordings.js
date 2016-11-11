Template.recordings.created = function() {
  Session.set('loadingLayout', true);
};

Template.recordings.rendered = function() {
  setTimeout(function() {
    Session.set('loadingLayout', false);
    $('.content').show();
  }, 2000);
};
