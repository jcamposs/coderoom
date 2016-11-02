UploaderManager = (function () {

  var module = {};

  module.insertPermissions = function(data) {
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

    xhr.onload = function() {
      console.log('Set permissions ok to ' + data.body.value);
    }.bind(this);

    xhr.send(JSON.stringify(body));
  };

  module.upload = function(data) {
    var uploader = new GDriveUploader({
      file: data.file,
      token: data.token,
      onComplete: data.onComplete,
      onError: function(err) {
        throwAlert('error', 'Error uploading media: ' + err, 'alert-circle');
      }
    });

    // Upload video
    uploader.upload();
  };

  return module;

}());
