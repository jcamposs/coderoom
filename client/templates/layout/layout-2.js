Template.layout_2.created = function() {
  Session.set('loading', true);
};

Template.layout_2.helpers({
  loading: function() {
    return Session.get('loading');
  }
});
