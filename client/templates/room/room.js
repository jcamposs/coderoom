function initRoom(name) {
  var room = Rooms.findOne({name: name});
  $pop = Popcorn("#video-room__local");

  if (room) {
    Session.set('currentRoom', room._id);
    ifaceMedia = MediaManager.initUserMedia(room._id, $pop);
  } else {
    Room.create(name, function(roomId) {
      Session.set('currentRoom', roomId);
      ifaceMedia = MediaManager.initUserMedia(roomId, $pop);
    });
  }
};

Template.room.rendered = function() {
  var roomName = this.data;
  initRoom(roomName);
};

Template.room.events({
  'click .room_participant-js': function (e) {
    var role = $('input[name=role]:checked').val() || 'viewer';

    if (role == 'admin') {
      var participantEl = $(e.currentTarget);
      ifaceMedia.setParticipantOnline(participantEl);
    }
  },
});

Tracker.autorun(function() {
  if(Session.get('recording')) {
    // If admin record editor events
    var role = $('input[name=role]:checked').val() || 'viewer';

    if (role == 'admin' && Session.get('document')) {
      recordEditor(ace.edit('editor'));
    }

    ifaceMedia.recordMedia();
  }

  if(Session.get('upload')) {
    ifaceMedia.stopRecordMedia();
    var room = Session.get('currentRoom');
    console.log(Room.getTimeline(room))
  }
});

function recordEditor(e) {
  var editor = e;
  var room = Session.get('currentRoom');

  console.log("Recording...");
  var initTimestamp = $pop.currentTime(); //actualizo la fecha de inicio de grabación.
  console.log("he actualizado la fecha de inicio");
  // Editor Events

  //change content events.
  editor.getSession().on('change', function(e) {
    switch (e.action) {
      case 'remove':
        var range = {
          start: e.start,
          end: e.end
        };

        var ev = {
          timestamp: $pop.currentTime() - initTimestamp,
          arg: range,
          toDo: 'editor.getSession().getDocument().remove(arg);'
        };
        Room.insertEvent(room, ev);

        break;
      case 'insert':
        var ev = {
          timestamp: $pop.currentTime() - initTimestamp,
          arg: {start: e.start, lines: e.lines},
          toDo: 'editor.getSession().getDocument().insertMergedLines(arg.start, arg.lines)'
        };
        Room.insertEvent(room, ev);
        break;
    }
  });

  //selection events
  editor.getSession().selection.on('changeSelection', function(e) {
    var selection = editor.getSession().selection;

    if(!selection.isEmpty()) {
      var range = selection.getRange();
      var ev = {
        timestamp: $pop.currentTime() - initTimestamp,
        arg: range,
        toDo: 'editor.getSession().selection.setSelectionRange(arg);'
      };
      Room.insertEvent(room, ev);
    } else {
      var ev = {
        timestamp: $pop.currentTime() - initTimestamp,
        toDo: 'editor.getSession().selection.clearSelection();'
      };
      Room.insertEvent(room, ev);
    }
  });

  //cursor events
  editor.getSession().selection.on('changeCursor', function(e) {
    var ev = {
      timestamp: $pop.currentTime() - initTimestamp,
      arg: editor.getSession().selection.getCursor(),
      toDo: 'editor.getSession().selection.moveCursorToPosition(arg);'
    };
    Room.insertEvent(room, ev);
  });

  //scroll events
  editor.getSession().on('changeScrollTop', function(sT) {
    if (Session.get('recording')) {
      var ev = {
        timestamp: $pop.currentTime() - initTimestamp,
        type: 'scroll',
        arg: {type: 'top', value: sT}
      };
      Room.insertEvent(room, ev);
    }
  });

  editor.getSession().on('changeScrollLeft', function(sL) {
    if (Session.get('recording')) {
      var ev = {
        timestamp: $pop.currentTime() - initTimestamp,
        type: 'scroll',
        arg: {type: 'left', value: sL}
      };
      Room.insertEvent(room, ev);
    }
  });
}
