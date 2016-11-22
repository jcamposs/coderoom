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

Template.newRecording.events({
  'submit': function(event) {
    event.preventDefault();

    checkForm(event);
  }
});

function checkForm(event) {
  var msg = ['Recording title should not be empty'];
  var errors = document.getElementById('errors-container');

  var form = document.getElementById('recording-form');
  var allInputs = form.getElementsByTagName('input');
  var currentBrdObj;

  for (var i = 0; i < allInputs.length; i++) {
    if (allInputs[i].value === '') {
      errors.innerHTML = msg[i];
      if (currentBrdObj) {
        currentBrdObj.style.border = '1px solid #e0e0e0';
      }
      allInputs[i].style.border = '1px solid #f34235';
      currentBrdObj = allInputs[i];
      allInputs[i].onclick = function() {
        this.style.border = '1px solid #e0e0e0';
      };
      return;
    }
  }

  var target = event.target;
  var name = target.text.value;
  var editorMode = Session.get('editorMode').module;

  $('.modal').modal('hide');

  createRecording(name, editorMode);

  resetForm(form);
};

function resetForm(form) {
  var allInputs = form.getElementsByTagName('input');
  var errors = document.getElementById('errors-container');

  for (var i = 0; i < allInputs.length; i++) {
    allInputs[i].style.border = '1px solid #e0e0e0';
  }
  errors.innerHTML = '';
  form.reset();
};

function createRecording(title, mode) {
  Meteor.call('insertRecording', title, mode, function(err, result) {
    if(err) {
      throwAlert('error', 'Error when create recording', 'alert-circle');
    }

    if (result) {
      RoomManager.setRoomRecording({id: result, title: title});
      Session.set('recording', true);
    }
  });
};
