Meteor.subscribe('userData', function() {
  getAccessToken(Meteor.user());
});


function getAccessToken(user) {
  var googleService = user.services.google;

  // is token still valid for the next minute ?
  if (googleService.expiresAt < Date.now() + 60 * 1000) {
    Meteor.call('exchangeRefreshToken', user._id, function(err, result) {
      if(err) {
        console.log('Error when refresh token');
      }

      if (result) {
        console.log('Token update ok ' + result);
      }
    })
  }
}
