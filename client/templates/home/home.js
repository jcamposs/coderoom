Template.home.created = function() {
  Session.set('loading', true);
};

Template.home.rendered = function() {
  Session.set('loading', false);
};

Template.home.helpers({
  recordings: function () {
    return Recordings.find({state: 'finished'});
  },
  rooms: function () {
    return Rooms.find();
  }
});

Template.registerHelper('parseDuration', function (value) {
  var durationMinute = Math.floor(value / 60);
  var durationSecond = Math.floor(value - durationMinute * 60);
  durationSecond = (String(durationSecond).length > 1) ? durationSecond : (String('0') + durationSecond);
  return durationMinute + ':' + durationSecond;
});
