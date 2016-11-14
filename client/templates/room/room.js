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

Template.room.created = function() {
  var roomOwner = this.data.owner;
  var defaultDoc = this.data._id;

  // Initialize session variables
  Session.set('isEdition', true);
  Session.set('document', defaultDoc);
  Session.set('live', false);
  Session.set('recording', false);
  Session.set('stopping', false);
  Session.set('uploadingMedia', false);
  Session.set('uploadingMediaScreen', false);
  Session.set('loadingMedia', true);

  if(roomOwner === Meteor.userId() && this.data.state === 'offline') {
    Rooms.update({_id: this.data._id}, {$set:{state: 'online'}});
    Session.set('isModerator', true);
  } else {
    Session.set('isModerator', false);
  }
};

Template.room.rendered = function() {
  var roomId = this.data._id;
  var participantProfile = getParticipantProfile();

  var options = {
    autoRequestMedia: true,
    enableDataChannels: true,
    room: roomId,
    nick: participantProfile,
    socketio: {'force new connection': true}
  };

  var webrtc = MediaManager.connect(options);

  // Save room config and webrtc in manager
  RoomManager.setRoomConfig(this.data);
  RoomManager.setWebRTC(webrtc);
};

Template.room.destroyed = function() {
  // Stop video and leave room
  var webrtc = RoomManager.getWebRTC();
  webrtc.stopLocalVideo();
  webrtc.leaveRoom();

  if(Session.get('isModerator')) {
    var roomConfig = RoomManager.getRoomConfig();
    var room = Rooms.find({_id: roomConfig._id}).fetch();
    if(room) {
      Rooms.update({_id: roomConfig._id}, {$set:{state: 'offline'}});
    }
  };

  // Reset session variables
  Session.set('isEdition', false);
  Session.set('isModerator', false);
  Session.set('document', undefined);
  Session.set('live', false);
  Session.set('recording', false);
  Session.set('stopping', false);
  Session.set('uploadingMedia', false);
  Session.set('uploadingMediaScreen', false);
  Session.set('loadingMedia', false);
};

Template.room.helpers({
  isModerator: function() {
    return Session.get('isModerator');
  }
});

Template.room.events({
  'click .room_participant-js': function(e) {
    if(Session.get('isModerator') && Session.get('live')) {
      var pId = $(e.target).closest('.room_participant-js').attr('id');
      var localStream = RoomManager.getLocalStream();
      if (localStream.id !== pId) {
        MediaManager.updateSecondaryParticipant(pId);
      }
    }
  }
});

function getParticipantProfile() {
  var googleService = Meteor.user().services.google;
  return {
    name: googleService.name,
    email: googleService.email,
    image: googleService.picture,
    role: Session.get('isModerator') ? 'moderator' : 'speaker'
  };
};
