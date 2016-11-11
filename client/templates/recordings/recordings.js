Template.recordings.created = function() {
  Session.set('loadingLayout', true);
};

Template.recordings.rendered = function() {
  Session.set('loadingLayout', false);
  $('.content').show();
};
