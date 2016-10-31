function Participant(conf) {

  this.stream = conf.stream;
  this.profile = conf.profile;
  this.participantElement;

  var that = this;

  this.setMain = function () {
    var mainVideo = document.getElementById('main-video');
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
