Template.alert.rendered = function(){
  var alert = this.data;

  Meteor.setTimeout(function () {
    Alerts.remove(alert._id);
  }, 2000);
};
