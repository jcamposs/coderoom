/**
 *   Copyright (C) 2016 Jorge Campos Serrano.
 *
 *   This program is free software: you can redistribute it and/or  modify
 *   it under the terms of the GNU Affero General Public License, version 3,
 *   as published by the Free Software Foundation.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Affero General Public License for more details.
 *
 *   You should have received a copy of the GNU Affero General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *   As a special exception, the copyright holders give permission to link the
 *   code of portions of this program with the OpenSSL library under certain
 *   conditions as described in each individual source file and distribute
 *   linked combinations including the program with the OpenSSL library. You
 *   must comply with the GNU Affero General Public License in all respects
 *   for all of the code used other than as permitted herein. If you modify
 *   file(s) with this exception, you may extend this exception to your
 *   version of the file(s), but you are not obligated to do so. If you do not
 *   wish to do so, delete this exception statement from your version. If you
 *   delete this exception statement from all source files in the program,
 *   then also delete it in the license file.
 */

Player = (function () {
  var module = {};

  var elements = {
    playerContainer: '.player__controls-container',
    mediaVideo: '#main-media',
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
  var progressBarHeight = 100;

  var duration;

  function defaultSettings(d) {
    $(elements.mediaVideo)[0].controls = false;
    isPlay = false;
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
  };

  function videoEndControl(mediaPlayer) {
    if (mediaPlayer.currentTime >= duration) {
      isPlay = false;
      playControlVideo();
    }
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
      videoEndControl(mediaPlayer);
      setIndicator(mediaPlayer.currentTime, duration);
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
    };

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
    });
  }

  module.init = function(d) {
    defaultSettings(d);
    clickSettings();
    playControlVideo();
    progressControlVideo();
  };

  module.destroy = function() {
    $(window).off('resize');
  };

  return module;
}());
