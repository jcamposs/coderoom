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

  this.removeMain = function () {
    $(that.participantElement).removeClass('room__participant--active');
  };

  this.remove = function () {
    if (that.participantElement !== undefined) {
      if (that.participantElement.parentNode !== null) {
        that.participantElement.parentNode.removeChild(that.participantElement);
      }
    }
  };

  function addParticipantEl() {
    that.participantElement = document.createElement('div');
    that.participantElement.setAttribute("id", that.stream.id );
    that.participantElement.className = "room__participant room_participant-js";

    var buttonState = document.createElement('i');
    buttonState.className = 'mdi mdi-checkbox-blank-circle';
    that.participantElement.appendChild(buttonState);

    var imgParticipant = document.createElement('img');
    imgParticipant.setAttribute("src", that.profile.img);
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
  var participants = {};

  function updateVideoStyle() {
    var MAX_WIDTH = 14;
    var numParticipants = Object.keys(participants).length;
    var maxParticipantsWithMaxWidth = 98 / MAX_WIDTH;

    if (numParticipants > maxParticipantsWithMaxWidth) {
        $('.room__participant').css({
            "width": (98 / numParticipants) + "%"
        });
    } else {
        $('.room__participant').css({
            "width": MAX_WIDTH + "%"
        });
    }
  };

  module.updateMainParticipant = function(participant) {
    if (mainParticipant) {
      mainParticipant.removeMain();
    };
    mainParticipant = participant;
    mainParticipant.setMain();
  };

  module.addLocalParticipant = function(stream) {
    localParticipant = this.addParticipant(stream);
    return localParticipant;
  };

  module.addParticipant = function(conf) {
    var participant = new Participant(conf);
    participants[conf.stream.id] = participant;

    updateVideoStyle();

    //Add event listener in every participant if is admin
    if(RoomManager.getLocalUser().role == 'admin') {
      $(participant.participantElement).click(function (e) {
        var msg = {
          "id": participant.stream.id,
          "recording": Session.get("recording")
        };
        MediaManager.sendToAllMessage('muteMedia');
        MediaManager.sendToAllMessage('setMainParticipant', msg);
        module.updateMainParticipant(participant);
      });
    }

    // Set main participant first time
    if(participant.profile.role == 'admin') {
      mainParticipant = participant;
      mainParticipant.setMain();
    }

    return participant;
  };

  module.removeParticipantByStream = function (stream) {
    this.removeParticipant(stream.id);
  };

  module.removeParticipant = function (streamId) {
    var participant = participants[streamId];
    delete participants[streamId];
    participant.remove();

    updateVideoStyle();
  };

  module.getParticipants = function () {
    return participants;
  };

  return module;

}());
