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

  var currentEventId;

  function isModerator(value) {
    return value == 'moderator';
  };

  function makeId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  };

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
    var that = this;

    var participant = new Participant(conf);
    participants[conf.stream.id] = participant;

    // Set moderator as then main participant
    if(isModerator(participant.profile.role)) {
      mainParticipant = participant;
      mainParticipant.setMain();
    }

    //Add event listener in every participant if is moderator and if is remote participant and event click
    if(Session.get('isModerator') && conf.remote) {
      $(participant.participantElement).click(function(e) {
        // if active any secondary participant fire event stop
        if(secondaryParticipant) {
          var ev = {
            id: currentEventId,
            type: 'media',
            toDo: 'remove',
            arg: secondaryParticipant.stream.id
          };
          Session.set('participantEvent', ev);
        };

        // Send message to mute previous secondary participant
        MediaManager.sendToAllMessage('muteMedia');

        // Send message to set a new secondary participant
        currentEventId = makeId();

        var msg = {
          'to': participant.stream.id,
          'data': {
            id: currentEventId,
            state: Session.get("recording"),
            info: Session.get('recordingData')
          }
        };
        MediaManager.sendToAllMessage('setSecondaryParticipant', msg);

        // Update a new secondary participant in moderator interface
        that.updateSecondaryParticipant(participant);

        // If new secondary participant fire event insert. Have a timeout because if collapsed before fire.
        if(secondaryParticipant) {
          var ev = {
            id: currentEventId,
            type: 'media',
            toDo: 'insert',
            arg: participant.stream.id
          };

          setTimeout(function(){
            Session.set('participantEvent', ev);
          }, 10);
        }
      });
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
  };

  module.getSecondaryParticipant = function() {
    return secondaryParticipant;
  };

  module.getParticipants = function() {
    return participants;
  };

  return module;

}());
