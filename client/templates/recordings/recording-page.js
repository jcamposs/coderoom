var mainVideoEl;
var editor;
var $pop;
var recording;

Template.recordingPage.created = function(){
  var defaultDoc = this.data._id;
  Session.set('document', defaultDoc);
}

Template.recordingPage.rendered = function(){
  recording = this.data;
  console.log('Loading recording... ' + JSON.stringify(recording));

  // Get DOM elements
  mainVideoEl = document.getElementById('main-video');

  // Initialize editor
  editor = ace.edit('editor');
  setTimeout(function(){
    editor.setValue('');
  }, 3000);


  // Initialize popcorn instance
  $pop = Popcorn("#main-video");
  $pop.defaults('inception', {
    target: 'chat__container'
  });

  // Listen for seeked event
  mainVideoEl.addEventListener('seeked', function(e) {
    editor.setValue('');

    var pos = this.currentTime;
    var listToDo = (pos)? (recording.events).filter(function(e) {
      return e.timestamp <= pos;
    }) : [];

    if (listToDo.length > 0) {
      updateSeek(listToDo);
    }

  }, false );

  var mediaEvents = recording.events.filter(function(e) {
    return e.type == 'media';
  });

  var editorEvents = recording.events.filter(function(e) {
    return e.type == 'text';
  });

  syncMediaEvents(mediaEvents);
  syncEditorEvents(editorEvents);
}

function searchSrcMedia(list, id) {
  return list.filter(function(m) { return m.user === id; })[0];
}

function getSrcMedia(id) {
  var mediaList = recording.videos;
  var srcMedia = searchSrcMedia(mediaList, id);

  var i = mediaList.indexOf(srcMedia);
  if(i != -1) {
    mediaList.splice(i, 1);
  }

  return srcMedia.file;
}

function searchEndEvent(list, id) {
  return list.filter(function(p) {return (p.arg == id && p.toDo == 'remove')})[0];
}

function getEndEvent(list, id) {
  var ev = searchEndEvent(list, id);

  var i = list.indexOf(ev);
  if(i != -1) {
    list.splice(i, 1);
  }

  return ev;
}

function syncMediaEvents(list) {
  var count = 0;
  _(list).each(function(e) {
    if(e.toDo == 'insert') {
      count++;
      var file = getSrcMedia(e.arg);
      var endEvent = getEndEvent(list, e.arg);

      download(file, function(srcVideo) {
        if (e.timestamp > 0) {
          $pop.inception({
            start: e.timestamp + 0.5,
            end: endEvent.timestamp,
            source: srcVideo,
            sync: true,
            top: '0',
            right: '0',
            width: '35%'
          });
        } else {
          mainVideoEl.setAttribute('src', srcVideo);
        }

        count--;
        if(count == 0) {
          Session.set('loading', false);
        }
      })
    }
  });
}

function syncEditorEvents(list) {
  _(list).each(function(e) {
    $pop.cue(e.timestamp, function() {
      var func = new Function('editor', 'arg', e.toDo);
      func(editor, e.arg);
    });
  });
}

function updateSeek(list) {
  _(list).each(function(e) {
    if (e.type == 'text'){
      var func = new Function('editor', 'arg', e.toDo);
      func(editor, e.arg);
    }
  });
};

function download(file, callback) {
  var downloader = new GDriveDownloader({
    fileId: file,
    token: Meteor.user().services.google.accessToken,
    onComplete: function(data) {
      console.log('blob: ' + data);
      callback(data);
    }
  });

  // Upload video
  downloader.download();
  console.log('Downloading ' + file);
}
