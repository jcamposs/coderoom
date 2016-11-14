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

function Participant(conf) {

  this.stream = conf.stream;
  this.profile = conf.profile;
  this.participantElement;

  var that = this;

  this.setMain = function () {
    var mainVideo = document.getElementById('main-media');
    var src = window.URL.createObjectURL(that.stream);
    mainVideo.setAttribute('src', src);

    that.participantElement.className += ' room__participant--active';
  };

  this.setSecondary = function () {
    var src = window.URL.createObjectURL(that.stream);

    var p = '<div class="media__participant media__participant--active">';
    p += '<video src="' + src + '" muted autoplay></video>';
    p += '</div>';

    $('.media__participants__container').append(p);

    that.participantElement.className += ' room__participant--active';
  };

  this.removeSecondary = function () {
    this.removeMediaSecondary();
    $(that.participantElement).removeClass('room__participant--active');
  };

  this.remove = function () {
    if (that.participantElement !== undefined && that.participantElement.parentNode !== null) {
      that.participantElement.parentNode.removeChild(that.participantElement);
    }
  };

  this.removeMediaSecondary = function() {
    $('.media__participants__container').find('.media__participant').remove();
  };

  function addParticipantEl() {
    that.participantElement = document.createElement('div');
    that.participantElement.setAttribute("id", that.stream.id );
    that.participantElement.className = "room__participant room_participant-js";

    var buttonState = document.createElement('i');
    buttonState.className = 'mdi mdi-checkbox-blank-circle';
    that.participantElement.appendChild(buttonState);

    var imgParticipant = document.createElement('img');
    imgParticipant.setAttribute("src", that.profile.image);
    imgParticipant.className = 'room__participant__image__profile';
    that.participantElement.appendChild(imgParticipant);

    var nameParticipant = document.createElement('div');
    var content = document.createTextNode(that.profile.name);
    nameParticipant.appendChild(content);
    nameParticipant.className = 'room__participant__name';
    that.participantElement.appendChild(nameParticipant);

    $('.room__participants').append(that.participantElement);
  };

  addParticipantEl();
}

ParticipantsManager = (function () {

  var module = {};

  var mainParticipant;
  var secondaryParticipant;
  var participants = {};

  function isModerator(value) {
    return value === 'moderator';
  };

  module.updateSecondaryParticipant = function(participant) {
    if (secondaryParticipant) {
      secondaryParticipant.removeSecondary();

      // Remove secondary participant if click when is actived
      if(secondaryParticipant.stream.id === participant.stream.id) {
        secondaryParticipant = null;
        return;
      }
    };
    secondaryParticipant = participant;
    secondaryParticipant.setSecondary();
  };

  module.addLocalParticipant = function(stream) {
    var localParticipant = this.addParticipant(stream);
    return localParticipant;
  };

  module.addParticipant = function(conf) {
    var participant = new Participant(conf);
    participants[conf.stream.id] = participant;

    // Set moderator as then main participant
    if(isModerator(participant.profile.role)) {
      mainParticipant = participant;
      mainParticipant.setMain();
    }

    return participant;
  };

  module.getParticipantById = function(id) {
    return participants[id];
  };

  module.removeParticipantByStream = function(stream) {
    this.removeParticipant(stream.id);
  };

  module.removeParticipant = function(streamId) {
    var participant = participants[streamId];
    delete participants[streamId];
    participant.remove();

    if(participant === secondaryParticipant) {
      participant.removeMediaSecondary();
    }
  };

  module.getSecondaryParticipant = function() {
    return secondaryParticipant;
  };

  module.getParticipants = function() {
    return participants;
  };

  return module;

}());
