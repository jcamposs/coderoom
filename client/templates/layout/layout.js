Template.layout.created = function() {
  Session.set('loading', true);
};

Template.layout.rendered = function() {
  Session.set('loading', false);
};

Template.layout.helpers({
  loading: function() {
    return Session.get('loading');
  }
});

Template.layout.events({
  'click .header-js-toggle': function(e) {
    $('.sidebar').toggleClass('sidebar--open');
    $('.content-wrapper').toggleClass('content-wrapper--open')
  }
});
