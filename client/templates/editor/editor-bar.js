Template.editorBar.helpers({
  themes: function() {
    return getThemes();
  },

  modes: function() {
    return getModes();
  },
});

Template.editorBar.rendered = function () {
  var defaultMode = getModes().find(function(i) {
    return i.name == 'JavaScript';
  });

  setModeEditor(defaultMode);
};

Template.editorBar.events({
  'click #editor__bar__select__language .dropdown-menu li': function (e) {
    var mode = {
      name: $(e.target).text(),
      module: $(e.target).data('language'),
    };

    setModeEditor(mode);
  },
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

function getModes() {
  var modes = [
    {name: 'ADA',          module:'ada'},
    {name: 'ActionScript', module:'actionscript'},
    {name: 'C & C++',      module:'c_cpp'},
    {name: 'Clojure',      module:'clojure'},
    {name: 'Cobol',        module:'cobol'},
    {name: 'CoffeeScript', module:'coffee'},
    {name: 'C#',           module:'csharp'},
    {name: 'CSS',          module:'css'},
    {name: 'Django',       module:'django'},
    {name: 'Go',           module:'go'},
    {name: 'HTML',         module:'html'},
    {name: 'Handlebars',   module:'handlebars'},
    {name: 'HAML',         module:'haml'},
    {name: 'Jade',         module:'jade'},
    {name: 'Java',         module:'java'},
    {name: 'JavaScript',   module:'javascript'},
    {name: 'JSON',         module:'json'},
    {name: 'LaTex',        module:'latex'},
    {name: 'LESS',         module:'less'},
    {name: 'Markdown',     module:'markdown'},
    {name: 'MATLAB',       module:'matlab'},
    {name: 'MySQL',        module:'mysql'},
    {name: 'Objective-C',  module:'objectivec'},
    {name: 'Pascal',       module:'pascal'},
    {name: 'Perl',         module:'perl'},
    {name: 'pgSQL',        module:'pgsql'},
    {name: 'PHP',          module:'php'},
    {name: 'Python',       module:'python'},
    {name: 'Ruby',         module:'ruby'},
    {name: 'SASS',         module:'sass'},
    {name: 'Scala',        module:'scala'},
    {name: 'SCSS',         module:'scss'},
    {name: 'SQL',          module:'sql'},
    {name: 'SQLServer',    module:'sqlserver'},
    {name: 'Stylus',       module:'stylus'},
    {name: 'SVG',          module:'svg'},
    {name: 'Swift',        module:'swift'},
    {name: 'TypeScript',   module:'typescript'},
    {name: 'Velocity',     module:'velocity'},
    {name: 'XLM',          module:'xml'},
    {name: 'YAML',         module:'yaml'}
  ]
  return modes;
}

function setModeEditor(mode) {
  $('#editor__bar__select__language').find('.editor__bar__filtered__option').text(mode.name);

  var editor = ace.edit('editor');
  editor.getSession().setMode('ace/mode/' + mode.module);
}
