Template.layout.created = function() {
  Session.set('loadingLayout', true);
};

Template.layout.rendered = function() {
  setTimeout(function() {
    Session.set('loadingLayout', false);
  }, 2000);
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
