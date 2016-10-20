var mode;

Template.editor.helpers({
  docid: function () {
    return Session.get('document');
  },
  configAce: function () {
    return function(ace) {
      ace.setTheme('ace/theme/monokai')
      ace.setShowPrintMargin(false)
      ace.getSession().setUseWrapMode(true)
      ace.$blockScrolling = Infinity;
    }
  },
  setMode: function () {
    return function(ace) {
      ace.setReadOnly(true);
      if(mode == 'edit') {
        addListeners(ace);
      }
    }
  }
});

Template.editor.created = function() {
  mode = this.data.mode;
};

function addListeners(editor) {
  console.log('add listener editor');

  // Editor Events
  editor.getSession().on('change', function(e) {
    switch (e.action) {
      case 'remove':
        var ev = {
          type: 'text',
          toDo: 'editor.getSession().getDocument().remove(arg);',
          arg: {start: e.start, end: e.end}
        };
        Session.set('editorEvent', ev);
        break;
      case 'insert':
        var ev = {
          type: 'text',
          toDo: 'editor.getSession().getDocument().insertMergedLines(arg.start, arg.lines)',
          arg: {start: e.start, lines: e.lines}
        };
        Session.set('editorEvent', ev);
        break;
    }
  });
};
