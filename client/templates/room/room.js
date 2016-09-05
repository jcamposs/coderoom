function initRoom(name) {
  var room = Rooms.findOne({name: name});

  if (room) {
    Session.set('currentRoom', room._id);
    ifaceMedia = MediaManager.initUserMedia(room._id);
  } else {
    Room.create(name, function(roomId) {
      Session.set('currentRoom', roomId);
      ifaceMedia = MediaManager.initUserMedia(roomId);
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
    Timeline.useTimebar(Popcorn("#video-room__local"));
    timeline = Timeline.create();
    EditorManager.useTimeline(timeline);

    // If admin record editor events
    var role = $('input[name=role]:checked').val() || 'viewer';

    if (role == 'admin' && Session.get('document')) {
      EditorManager.useEditor(ace.edit('editor'));
      EditorManager.addListeners();
    }

    if (role == 'admin') {
      var participantId = Session.get('user').id;

      var ev = {
        type: 'video',
        timestamp: timeline.getCurrentTime(),
        toDo: 'insertVideo',
        arg: participantId
      };
      timeline.insertEvent(ev);

      createRecording('recordingTest31Agosto');
    }

    ifaceMedia.recordMedia();
  }

  if(Session.get('upload')) {
    ifaceMedia.stopRecordMedia();
    setTimeout(function(){
      SyncUploading();
    }, 1000);
  }
});

function createRecording(title) {
  var recording = {
    title: title
  };

  Meteor.call('insertRecording', recording, function(err, result){
    if(err){
      console.log("Error when create recording");
    }
    if (result){
      var idRecord = result._id;
      Room.addRecording(Session.get('currentRoom'), idRecord);
      console.log("Recording created ok " + idRecord);
    }
  });
};

function SyncUploading() {
  var blob = ifaceMedia.generateBlob('file-user-29Julio');
  upload(blob, function(fileID) {
    var id = Room.getRecording(Session.get('currentRoom'));
    updateRecording(id, fileID);
  });
}

function upload(file, callback) {
  var uploader = new GDriveUploader({
    file: file,
    token: Meteor.user().services.google.accessToken,
    onComplete: function(data) {
      var jsonResponse = JSON.parse(data);
      fileID = jsonResponse.id
      console.log("Video subido ok " + fileID)

      callback(fileID)
    },
    onError: function(data) {
      console.log('Upload error');
    }
  });

  // Upload video
  uploader.upload();
  console.log('Uploading');
}

function updateRecording(id, data) {
  console.log('update recording with video ' + data);
  var r = Recordings.findOne({_id: id});
  if(r){
    console.log('Update data base');
    Recordings.update({_id: id},{"$push":{videos: {user: Session.get('user').id, file: data}}});
  }

  var role = $('input[name=role]:checked').val() || 'viewer';
  if (role == 'admin') {
    console.log('update recording with events editor timeline.getEvents');
    Recordings.update({_id: id},{"$push":{RC: timeline.getEvents()}});
  }
}
