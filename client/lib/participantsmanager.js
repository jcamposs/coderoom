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

    var p = '<div class="room__chat__participant room__chat__participant--active">'
    p += '<video src="' + src + '" muted autoplay></video>'
    p += '</div>';

    $('.room__chat__participants').append(p);

    that.participantElement.className += ' room__participant--active';
  };

  // this.removeMain = function () {
  //   $(that.participantElement).removeClass('room__participant--active');
  // };

  this.removeSecondary = function () {
    $('.room__chat__participants').find('.room__chat__participant').remove();
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
  var secondaryParticipant;
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

  // module.updateMainParticipant = function(participant) {
  //   if (mainParticipant) {
  //     mainParticipant.removeMain();
  //   };
  //   mainParticipant = participant;
  //   mainParticipant.setMain();
  // };

  module.updateSecondaryParticipant = function(participant) {
    if (secondaryParticipant) {
      secondaryParticipant.removeSecondary();

      // Remove secondary participant if click when is actived
      if(secondaryParticipant.stream.id == participant.stream.id) {
        secondaryParticipant = null;
        return;
      }
    };
    secondaryParticipant = participant;
    secondaryParticipant.setSecondary();
  };

  module.addLocalParticipant = function(stream) {
    localParticipant = this.addParticipant(stream);
    return localParticipant;
  };

  module.addParticipant = function(conf) {
    var participant = new Participant(conf);
    participants[conf.stream.id] = participant;

    // updateVideoStyle();

    //Add event listener in every participant if is admin and if is remote participant and event click
    if(RoomManager.getLocalUser().role == 'admin' && conf.remote) {
      $(participant.participantElement).click(function (e) {
        if(secondaryParticipant && Session.get('recording')) {
          var timeline = RoomManager.getTimeline();
          timeline.insertEvent({
            type: 'video',
            timestamp: timeline.getCurrentTime(),
            toDo: 'stopVideo',
            arg: secondaryParticipant.stream.id
          });
        };

        var msg = {
          "id": participant.stream.id,
          "recording": {
            id: Session.get('recordId'),
            state: Session.get("recording")
          }
        };
        MediaManager.sendToAllMessage('muteMedia');
        MediaManager.sendToAllMessage('setSecondaryParticipant', msg);
        module.updateSecondaryParticipant(participant);

        if(secondaryParticipant && Session.get('recording')) {
          var timeline = RoomManager.getTimeline();
          timeline.insertEvent({
            type: 'video',
            timestamp: timeline.getCurrentTime(),
            toDo: 'insertVideo',
            arg: participant.stream.id
          });
        }
      });
    }

    // Set main participant first time
    if(participant.profile.role == 'admin') {
      mainParticipant = participant;
      mainParticipant.setMain();
    }

    return participant;
  };

  module.removeParticipantByStream = function(stream) {
    this.removeParticipant(stream.id);
  };

  module.removeParticipant = function(streamId) {
    var participant = participants[streamId];
    delete participants[streamId];
    participant.remove();

    updateVideoStyle();
  };

  module.getSecondaryParticipant = function() {
    return secondaryParticipant;
  };

  module.getParticipants = function() {
    return participants;
  };

  return module;

}());
