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

var mode;

Template.editor.helpers({
  docid: function () {
    return Session.get('document');
  },
  configAce: function () {
    return function(ace) {
      ace.setTheme('ace/theme/monokai');
      ace.setShowPrintMargin(false);
      ace.getSession().setUseWrapMode(true);
      ace.$blockScrolling = Infinity;
    };
  },
  setConfig: function () {
    return function(ace) {
      if(mode === 'edit') {
        ace.setValue('');
        ace.setReadOnly(false);
        addListeners(ace);
      } else {
        ace.setReadOnly(true);
      }

      if(Session.get('isPlayback')) {
        ace.setValue('');
      }

      Session.set('loadingEditor', false);
    };
  }
});

Template.editor.created = function() {
  Session.set('loadingEditor', true);
  mode = this.data.mode;
};

function addListeners(editor) {
  // Editor Events
  editor.getSession().on('change', function(e) {
    if(Session.get('recording')) {
      var ev;

      switch (e.action) {
        case 'remove':
          ev = {
            type: 'editor',
            toDo: 'editor.getSession().getDocument().remove(arg);',
            arg: {start: e.start, end: e.end}
          };
          break;
        case 'insert':
          ev = {
            type: 'editor',
            toDo: 'editor.getSession().getDocument().insertMergedLines(arg.start, arg.lines)',
            arg: {start: e.start, lines: e.lines}
          };
          break;
        default:
          break;
      }

      Timeline.addEvent(ev);
    }
  });

  //selection events
  editor.getSession().selection.on('changeSelection', function() {
    if(Session.get('recording')) {
      var ev;
      var selection = editor.getSession().selection;

      if(!selection.isEmpty()) {
        ev = {
          type: 'editor',
          toDo: 'editor.getSession().selection.setSelectionRange(arg);',
          arg: selection.getRange()
        };
      } else {
        ev = {
          type: 'editor',
          toDo: 'editor.getSession().selection.clearSelection();'
        };
      }

      Timeline.addEvent(ev);
    }
  });

  //cursor events
  editor.getSession().selection.on('changeCursor', function() {
    if(Session.get('recording')) {
      Timeline.addEvent({
        type: 'editor',
        toDo: 'editor.getSession().selection.moveCursorToPosition(arg);',
        arg: editor.getSession().selection.getCursor()
      });
    }
  });
};
