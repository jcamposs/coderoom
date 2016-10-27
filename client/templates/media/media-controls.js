Template.mediaControls.events({
  'click .btn-js-onoffvolume': function (e) {
    var localStream = RoomManager.getWebRTC();
    var element = $('.btn-js-onoffvolume').children();

    if (element.hasClass('mdi-volume-off')) { //on
      element.removeClass('mdi-volume-off');
      element.addClass('mdi-volume-high');
      localStream.unmute();
    } else { //off
      element.removeClass('mdi-volume-high');
      element.addClass('mdi-volume-off');
      localStream.mute();
    }
  },

  'click .btn-js-onoffvideocam': function (e) {
    var localStream = RoomManager.getWebRTC();
    var element = $('.btn-js-onoffvideocam').children();

    if (element.hasClass('mdi-video-off')) { //on
      element.removeClass('mdi-video-off');
      element.addClass('mdi-video');
      localStream.resumeVideo();
    } else { //off
      element.removeClass('mdi-video');
      element.addClass('mdi-video-off');
      localStream.pauseVideo();
    }
  }
});
