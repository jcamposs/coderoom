Template.layout.created = function() {
  Session.set('loading', true);
};

Template.layout.helpers({
  loading: function() {
    return Session.get('loading');
  },
  alerts: function() {
    return Alerts.find();
  }
});
