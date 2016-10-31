Template.layout_2.helpers({
  loading: function() {
    return Session.get('loadingMedia') || Session.get('loadingEditor');
  }
});
