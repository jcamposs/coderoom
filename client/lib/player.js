Player = (function () {
  var module = {};

  var elements = {
    playerContainer: '.player__controls-container',
    mediaVideo: '#media-video',
    playControl: '.player__play-control',
    playButton: '.player__play-button',
    pauseButton: '.player__pause-button',
    progress: '.player__progress',
    progressOver: '.player__progress-over',
    progressHidden: '.player__progress-hidden',
    progressBackground: '.player__progress-background',
    indicator: '.player__indicator'
  };

  var isPlay = true;
  var isEnd = false;
  var progressBarHeight = 100;

  function defaultSettings() {
    $(elements.mediaVideo)[0].controls = false;

    $(window).on('resize', onResize);

    function onResize(){
      var width = $(elements.playerContainer).width() - 223;
      $(elements.progress).width(width);
      $(elements.progressBackground).width(width - 60);
      $(elements.progressHidden).width(width - 60);

      progressBarHeight = width - 60;
      $(elements.progressOver).css('width', String( (progressBarHeight / $(elements.mediaVideo)[0].duration) * $(elements.mediaVideo)[0].currentTime ));
    }

    onResize();
  };

  function clickSettings() {
    $(elements.playControl).on('click', playControlVideo);
  };

  function playControlVideo() {
    if (isPlay) {
      $(elements.mediaVideo)[0].play();
    } else {
      $(elements.mediaVideo)[0].pause();
    }
    $(elements.playButton).css('display', ((isPlay) ? 'none' : 'table-cell'));
    $(elements.pauseButton).css('display', ((!isPlay) ? 'none' : 'table-cell'));
    isPlay = !isPlay;
    isEnd = false;
  };

  function progressControlVideo() {
    var mouseX = 0;
    var isDown = false;
    var currentMinute = 0;
    var currentSecond = 0;
    var mediaPlayer = $(elements.mediaVideo)[0];

    mediaPlayer.addEventListener('timeupdate', onProgressVideo, false);

    function onProgressVideo() {
      $(elements.progressOver).css('width', String((progressBarHeight / mediaPlayer.duration) * mediaPlayer.currentTime));
      videoEndControl();
      setIndicator(mediaPlayer.currentTime, mediaPlayer.duration);
    }

    function videoEndControl() {
      if (mediaPlayer.currentTime >= mediaPlayer.duration) {
        isPlay = false;
        playControlVideo();
        isEnd = true;
      }
    }

    function setIndicator(current, duration) {
      var durationMinute = Math.floor(duration / 60);
      var durationSecond = Math.floor(duration - durationMinute * 60);
      var durationLabel = durationMinute + ':' + durationSecond;
      currentSecond = Math.floor(current);
      currentMinute = Math.floor(currentSecond / 60);
      currentSecond = currentSecond - (currentMinute * 60);
      currentSecond = (String(currentSecond).length > 1) ? currentSecond : (String('0') + currentSecond);
      var currentLabel = currentMinute + ':' + currentSecond;
      var indicatorLabel = currentLabel + ' / ' + durationLabel;
      $(elements.indicator).text(indicatorLabel);
    }

    $(elements.progressHidden).on('mousemove', function(e) {
      var parentOffset = $(this).parent().offset();
      mouseX = Math.floor(e.pageX - parentOffset.left - 20);
      if (isDown) {
        mediaPlayer.currentTime = (mediaPlayer.duration / progressBarHeight) * mouseX;
      }
    });

    $(elements.progressHidden).on('click', function() {
      if (!isDown) {
        mediaPlayer.currentTime = (mediaPlayer.duration / progressBarHeight) * mouseX;
      }
    });

    $(elements.progressHidden).on('mousedown', function() {
      isDown = true;

      mediaPlayer.currentTime = (mediaPlayer.duration / progressBarHeight) * mouseX;

      $(elements.mediaVideo)[0].pause();
    });

    $(elements.progressHidden).on('mouseup', function() {
      isDown = false;
      if (!isEnd) {
        isPlay = true;
        playControlVideo();
      }
    });
  }

  module.init = function() {
    defaultSettings();
    clickSettings();
    playControlVideo();
    progressControlVideo();
  };

  return module
}());
