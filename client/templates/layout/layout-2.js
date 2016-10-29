Template.layout_2.helpers({
  loading: function() {
    return Session.get('loadingRoom') || Session.get('loadingEditor');
  }
});
