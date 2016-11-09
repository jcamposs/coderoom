Meteor.subscribe('userData', function() {
  var user = Meteor.user();

  if(user && user.services) {
    getAccessToken(user);
  }
});

function getAccessToken(user) {
  var googleService = user.services.google;

  // is token still valid for the next minute ?
  if (googleService.expiresAt < Date.now() + 60 * 1000) {
    Meteor.call('exchangeRefreshToken', user._id, function(err) {
      if(err) {
        throwAlert('error', 'Error when load credentials, login again please', 'alert-circle');
      }
    });
  }
}
