// Local (client-only) collection
Alerts = new Mongo.Collection(null);

throwAlert = function(type, message, icon) {
  var icon = icon || 'information';
  Alerts.insert({type: type, message: message, icon: icon})
}
