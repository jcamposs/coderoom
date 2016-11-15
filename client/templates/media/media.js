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

var initTimestamp;

Template.media.rendered = function() {
  $('#main-media').on('canplay', function() {
    Session.set('loadingRoom', false);
  });

  $('#main-media').on('timeupdate', function() {
    var time = 0;
    if(Session.get('live')) {
      time = this.currentTime - initTimestamp;
    }
    $('.room__controls__current-time').text(formatTime(time));
  });
};

Template.media.helpers({
  live: function() {
    return Session.get('live');
  },

  recording: function() {
    return Session.get('recording');
  },

  uploading: function() {
    return Session.get('uploadingMedia') || Session.get('uploadingMediaScreen');
  }
});

function formatTime(seconds) {
  var minutes = Math.floor(seconds / 60);
  minutes = (minutes >= 10) ? minutes : '0' + minutes;
  seconds = Math.floor(seconds % 60);
  seconds = (seconds >= 10) ? seconds : '0' + seconds;
  return minutes + ':' + seconds;
};

Tracker.autorun(function() {
  if(Session.get('live')) {
    initTimestamp = document.getElementById('main-media').currentTime;
  }
});
