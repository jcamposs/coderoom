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

Template.mediaControls.events({
  'click .btn-js-onoffvolume': function () {
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

  'click .btn-js-onoffvideocam': function () {
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
  },

  'click .btn-js-onvideocamcorder': function () {
    $('#newRecording.modal').modal('show');
  },

  'click .btn-js-offvideocamcorder': function () {
    Session.set('recording', false);
    Session.set('stopping', true);
  }
});

Template.mediaControls.helpers({
  isModerator: function() {
    return Session.get('isModerator');
  },

  live: function() {
    return Session.get('live');
  },

  recording: function () {
    return Session.get('recording');
  }
});
