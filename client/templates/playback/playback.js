Template.playback.created = function(){
  Session.set('document', 'sdqwedwf');
}

Template.playback.rendered = function() {
  Session.set('loading', false);

  Player.init();
}
