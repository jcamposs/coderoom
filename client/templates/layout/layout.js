Template.layout.created = function() {
  Session.set('loadingLayout', true);
};

Template.layout.rendered = function() {
  Session.set('loadingLayout', false);
};

Template.layout.helpers({
  loading: function() {
    return isLoading();
  },
  alerts: function() {
    return Alerts.find();
  }
});

function isLoading() {
  return Session.get('loadingLayout') || Session.get('loadingMedia') || Session.get('loadingEditor');
};
