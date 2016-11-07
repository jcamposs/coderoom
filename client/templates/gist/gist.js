Template.gist.created = function() {
  Session.set('uploadingGist', false);
  Session.set('gistUrl', undefined);
};

Template.gist.destroyed = function() {
  Session.set('uploadingGist', false);
  Session.set('gistUrl', undefined);
};

Template.gist.helpers({
  uploadingGist: function() {
    return Session.get('uploadingGist');
  },

  gistUrl: function() {
    return Session.get('gistUrl');
  }
});

Template.gist.events({
  'click .btn-js-save-gist': function() {
    var contentFile = ace.edit('editor').getValue();

    if (contentFile) {
      var fileName = 'coderoom-' + RoomManager.getRoomConfig()._id + '.' + Session.get('editorMode').ext;
      var data = {
        'description': 'Another codie from coderoom',
        'public': true,
        'files': {}
      }
      data.files[fileName] = {'content': String(contentFile)};

      uploadGist(data);
      Session.set('uploadingGist', true);
    }
  },

  'click .btn-js-open-gist': function() {
    Session.set('gistUrl', undefined);
  }
});

function uploadGist(data) {
  $.ajax({
    url: 'https://api.github.com/gists',
    type: 'POST',
    dataType: 'json',
    data: JSON.stringify(data)
  })
  .success( function(e) {
    Session.set('uploadingGist', false);
    Session.set('gistUrl', e.html_url);
  })
  .error( function() {
    throwAlert('error', 'Error saving gist', 'alert-circle');
  });
};
