UploaderManager = (function () {

  var module = {};

  function insertPermission(data) {
    var xhr = new XMLHttpRequest();
    var url = 'https://www.googleapis.com/drive/v2/files/' + data.fileId + '/permissions';

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + data.token);
    xhr.setRequestHeader('Content-Type', 'application/json');

    var body = {
      'value': data.body.value,
      'type': data.body.type,
      'role': data.body.role
    };

    xhr.onload = function(e, status) {
      console.log('Set permissions ok to ' + data.body.value);
    }.bind(this);

    xhr.send(JSON.stringify(body));
  }

  module.upload = function(data) {
    var uploader = new GDriveUploader({
      file: data.file,
      token: data.token,
      onComplete: function(response) {
        var fileId = JSON.parse(response).id;
        console.log("Video subido ok " + fileId);

        var recordId = Session.get('recordingData').id;
        console.log('update record with ', recordId)
        var r = Recordings.findOne({_id: recordId});
        if(r){
          console.log('Update data base');

          var sourceRecording = {
            id: Session.get('currentEventId'),
            file: fileId
          };

          Recordings.update(
            { _id: recordId },
            { '$push': { sources: sourceRecording } }
          );
          Session.set('recordingData', {});
        }

        var participants = ParticipantsManager.getParticipants();
        Object.keys(participants).forEach(function(key, i) {
          var permissionsConfig = {
            fileId: fileId,
            token: data.token,
            body: {
              value: participants[key].profile.email,
              type: 'user',
              role: 'reader'
            }
          };
          setTimeout(function() {
            insertPermission(permissionsConfig);
          }, i * 2000);
        });
        Session.set('loading', false);
      },
      onError: function(data) {
        console.log('Upload error');
      }
    });

    // Upload video
    uploader.upload();
    console.log('Uploading');
    Session.set('loading', true);
  };

  return module;

}());
