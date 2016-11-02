Template.editorBar.helpers({
  modes: function() {
    return getModes();
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
}

setModeEditor = function(mode) {
  $('#editor__bar__select__language').find('.editor__bar__filtered__option').text(mode.name);

  var editor = ace.edit('editor');
  editor.getSession().setMode('ace/mode/' + mode.module);
  Session.set('editorMode', {module: mode.module, ext: mode.extension});
}
