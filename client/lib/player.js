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

  var isPlay = false;
  var isEnd = false;
  var progressBarHeight = 100;

  var duration;

  function defaultSettings(d) {
    $(elements.mediaVideo)[0].controls = false;
    duration = d;

    $(window).on('resize', onResize);

    function onResize(){
      var width = $(elements.playerContainer).width() - 223;
      $(elements.progress).width(width);
      $(elements.progressBackground).width(width - 60);
      $(elements.progressHidden).width(width - 58);

      progressBarHeight = width - 60;
      $(elements.progressOver).css('width', String((progressBarHeight / duration) * $(elements.mediaVideo)[0].currentTime ));
    }

    onResize();
  };

  function clickSettings() {
    $(elements.playControl).on('click', playControlVideo);
  };

  function playControlVideo() {
    if (isPlay) {
      setTimeout(function () {
        $(elements.mediaVideo)[0].play();
      }, 200);
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
      $(elements.progressOver).css('width', String((progressBarHeight / duration) * mediaPlayer.currentTime));
      videoEndControl();
      setIndicator(mediaPlayer.currentTime, duration);
    }

    function videoEndControl() {
      if (mediaPlayer.currentTime >= duration) {
        isPlay = false;
        playControlVideo();
        isEnd = true;
      }
    }

    function setIndicator(current, duration) {
      var durationMinute = Math.floor(duration / 60);
      var durationSecond = Math.floor(duration - durationMinute * 60);
      durationSecond = (String(durationSecond).length > 1) ? durationSecond : (String('0') + durationSecond);
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
      mouseX = Math.floor(e.pageX - parentOffset.left - 30);
      if (isDown) {
        mediaPlayer.currentTime = (duration / progressBarHeight) * mouseX;
      }
    });

    $(elements.progressHidden).on('click', function() {
      if (!isDown) {
        mediaPlayer.currentTime = (duration / progressBarHeight) * mouseX;
      }
    });

    $(elements.progressHidden).on('mousedown', function() {
      isDown = true;
      mediaPlayer.currentTime = (duration / progressBarHeight) * mouseX;
      $(elements.mediaVideo)[0].pause();
    });

    $(elements.progressHidden).on('mouseup', function() {
      isDown = false;
      if (!isPlay) {
        isPlay = true;
        playControlVideo();
      }
    });

    $(elements.progressHidden).on('mouseout', function() {
      isDown = false;
      if(!isPlay) {
        isPlay = true;
        playControlVideo();
      }
    });
  }

  module.init = function(d) {
    defaultSettings(d);
    clickSettings();
    playControlVideo();
    progressControlVideo();
  };

  return module
}());
