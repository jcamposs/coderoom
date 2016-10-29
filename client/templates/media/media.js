Template.media.rendered = function() {
  $('#main-video').on('canplay', function() {
    Session.set('loadingRoom', false);
  });

  // mainVideo.addEventListener('timeupdate',function(){
  //   // var time = 0;
  //   // if(Session.get('recording')) {
  //   //   time = timeline.getCurrentTime();
  //   // }
  //   // $(".room__controls__current-time").text(formatTime(time));
  // }, false);
};
