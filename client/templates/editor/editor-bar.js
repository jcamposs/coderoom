Template.editorBar.helpers({
  themes: function() {
    return getThemes();
  },

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
  var defaultTheme = getThemes().find(function(i) {
    return i.name === 'Monokai';
  });
  setThemeEditor(defaultTheme);

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
  },

  'click #editor__bar__select__theme .dropdown-menu li': function (e) {
    var theme = {
      name: $(e.target).text(),
      module: $(e.target).data('theme')
    };

    setThemeEditor(theme);
  }
});

function getThemes() {
  var themes = [
    {name: 'Ambiance' ,module: 'ambiance'},
    {name: 'Chaos' ,module: 'chaos'},
    {name: 'Chrome' ,module: 'chrome'},
    {name: 'Clouds' ,module: 'clouds'},
    {name: 'Clouds Midnight' ,module: 'clouds_midnight'},
    {name: 'Cobalt' ,module: 'cobalt'},
    {name: 'Crimson Editor' ,module: 'crimson_editor'},
    {name: 'Dawn' ,module: 'dawn'},
    {name: 'Dreamweaver' ,module: 'dreamweaver'},
    {name: 'Eclipse' ,module: 'eclipse'},
    {name: 'GitHub' ,module: 'github'},
    {name: 'Gruvbox' ,module: 'gruvbox'},
    {name: 'idle Fingers' ,module: 'idle_fingers'},
    {name: 'IPlastic' ,module: 'iplastic'},
    {name: 'KatzenMilch' ,module: 'katzenmilch'},
    {name: 'krTheme' ,module: 'kr_theme'},
    {name: 'Kuroir' ,module: 'kuroir'},
    {name: 'Merbivore' ,module: 'merbivore'},
    {name: 'Mervibore Soft' ,module: 'mervibore_soft'},
    {name: 'Mono Indrustrial' ,module: 'mono_industrial'},
    {name: 'Monokai' ,module: 'monokai'},
    {name: 'Pastel on dark' ,module: 'pastel_on_dark'},
    {name: 'Solarized Dark' ,module: 'solarized_dark'},
    {name: 'Solarized Light' ,module: 'solarized_light'},
    {name: 'Terminal' ,module: 'terminal'},
    {name: 'Textmate' ,module: 'textmate'},
    {name: 'Tomorrow' ,module: 'tomorrow'},
    {name: 'Tomorrow Night' ,module: 'tomorrow_night'},
    {name: 'Tomorrow Night Blue' ,module: 'tomorrow_night_blue'},
    {name: 'Tomorrow Night Bright' ,module: 'tomorrow_night_bright'},
    {name: 'Tomorrow Night 80s' ,module: 'tomorrow_night_eighties'},
    {name: 'Twilight' ,module: 'twilight'},
    {name: 'Vibrant Ink' ,module: 'vibrant_ink'},
    {name: 'XCode' ,module: 'xcode'}
  ];
  return themes;
}

function setThemeEditor(theme) {
  $('#editor__bar__select__theme').find('.editor__bar__filtered__option').text(theme.name);

  var editor = ace.edit('editor');
  editor.setTheme('ace/theme/' + theme.module);
}

function getModes() {
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

function setModeEditor(mode) {
  $('#editor__bar__select__language').find('.editor__bar__filtered__option').text(mode.name);

  var editor = ace.edit('editor');
  editor.getSession().setMode('ace/mode/' + mode.module);
  Session.set('editorMode', {module: mode.module, ext: mode.extension});
}
