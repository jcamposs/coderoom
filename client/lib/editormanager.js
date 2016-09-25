EditorManager = (function () {

  var module = {};

  var editor;
  var timeline;

  module.addListeners = function() {
    // Editor Events
    editor.getSession().on('change', function(e) {
      if (Session.get('recording')) {
        switch (e.action) {
          case 'remove':
            var range = {
              start: e.start,
              end: e.end
            };
            timeline.insertEvent({
              timestamp: timeline.getCurrentTime(),
              arg: range,
              toDo: 'editor.getSession().getDocument().remove(arg);'
            });
            break;
          case 'insert':
            timeline.insertEvent({
              timestamp: timeline.getCurrentTime(),
              arg: {start: e.start, lines: e.lines},
              toDo: 'editor.getSession().getDocument().insertMergedLines(arg.start, arg.lines)'
            });
            break;
        }
      }
    });

    //selection events
    editor.getSession().selection.on('changeSelection', function(e) {
      if (Session.get('recording')) {
        var selection = editor.getSession().selection;

        if(!selection.isEmpty()) {
          var range = selection.getRange();
          timeline.insertEvent({
            timestamp: timeline.getCurrentTime(),
            arg: range,
            toDo: 'editor.getSession().selection.setSelectionRange(arg);'
          });
        } else {
          timeline.insertEvent({
            timestamp: timeline.getCurrentTime(),
            toDo: 'editor.getSession().selection.clearSelection();'
          });
        }
      }
    });

    //cursor events
    editor.getSession().selection.on('changeCursor', function(e) {
      if (Session.get('recording')) {
        timeline.insertEvent({
          timestamp: timeline.getCurrentTime(),
          arg: editor.getSession().selection.getCursor(),
          toDo: 'editor.getSession().selection.moveCursorToPosition(arg);'
        });
      };
    });

    //scroll events
    editor.getSession().on('changeScrollTop', function(sT) {
      if (Session.get('recording')) {
        timeline.insertEvent({
          timestamp: timeline.getCurrentTime(),
          type: 'scroll',
          arg: {type: 'top', value: sT}
        });
      };
    });

    editor.getSession().on('changeScrollLeft', function(sL) {
      if (Session.get('recording')) {
        timeline.insertEvent({
          timestamp: timeline.getCurrentTime(),
          type: 'scroll',
          arg: {type: 'left', value: sL}
        });
      };
    });
  };

  module.init = function(widget, tl) {
    editor = widget;
    timeline = tl;
  };

  return module;

}());
