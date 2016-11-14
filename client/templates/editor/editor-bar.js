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

Template.editorBar.helpers({
  modes: function() {
    return getModes();
  },

  isEdition: function() {
    return Session.get('isEdition');
  }
});

Template.editorBar.created = function() {
  Session.set('editorMode', undefined);
};

Template.editorBar.destroyed = function() {
  Session.set('editorMode', undefined);
};

Template.editorBar.rendered = function() {
  var defaultMode = getModes().find(function(i) {
    return i.name === 'Text';
  });
  setModeEditor(defaultMode);
};

Template.editorBar.events({
  'click #editor__bar__select__language .dropdown-menu li': function (e) {
    var mode = {
      name: $(e.target).text(),
      module: $(e.target).data('language'),
      extension: $(e.target).data('extension')
    };

    setModeEditor(mode);
  }
});

getModes = function() {
  var modes = [
    {name: 'ADA',          module:'ada',          extension: 'a'},
    {name: 'ActionScript', module:'actionscript', extension: 'js'},
    {name: 'C & C++',      module:'c_cpp',        extension: 'c'},
    {name: 'CoffeeScript', module:'coffee',       extension: 'coffe'},
    {name: 'CSS',          module:'css',          extension: 'css'},
    {name: 'Django',       module:'django',       extension: 'py'},
    {name: 'Go',           module:'go',           extension: 'go'},
    {name: 'HTML',         module:'html',         extension: 'html'},
    {name: 'Jade',         module:'jade',         extension: 'jade'},
    {name: 'Java',         module:'java',         extension: 'java'},
    {name: 'JavaScript',   module:'javascript',   extension: 'js'},
    {name: 'JSON',         module:'json',         extension: 'json'},
    {name: 'LaTex',        module:'latex',        extension: 'tex'},
    {name: 'LESS',         module:'less',         extension: 'less'},
    {name: 'Markdown',     module:'markdown',     extension: 'md'},
    {name: 'Pascal',       module:'pascal',       extension: 'pas'},
    {name: 'Perl',         module:'perl',         extension: 'pl'},
    {name: 'PHP',          module:'php',          extension: 'php'},
    {name: 'Python',       module:'python',       extension: 'py'},
    {name: 'Ruby',         module:'ruby',         extension: 'rb'},
    {name: 'SASS',         module:'sass',         extension: 'sass'},
    {name: 'Scala',        module:'scala',        extension: 'scala'},
    {name: 'SCSS',         module:'scss',         extension: 'scss'},
    {name: 'Text',         module:'text',         extension: 'txt'},
    {name: 'TypeScript',   module:'typescript',   extension: 'ts'},
    {name: 'XLM',          module:'xml',          extension: 'xml'}
  ];
  return modes;
};

setModeEditor = function(mode) {
  $('#editor__bar__select__language').find('.editor__bar__filtered__option').text(mode.name);

  var editor = ace.edit('editor');
  editor.getSession().setMode('ace/mode/' + mode.module);
  Session.set('editorMode', {module: mode.module, ext: mode.extension});

  if(Session.get('isModerator') && Session.get('live')) {
    MediaManager.sendToAllMessage('setEditorMode', mode);
  }
};
