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
        'description': 'Another file from coderoom',
        'public': true,
        'files': {}
      };
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
