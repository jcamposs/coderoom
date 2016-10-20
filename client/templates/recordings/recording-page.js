var mainVideoEl;
var editor;
var $pop;
var recording;

Template.recordingPage.created = function(){
  var defaultDoc = this.data._id;
  Session.set('document', defaultDoc);
}

Template.recordingPage.destroyed = function() {
  Player.destroy();
};

Template.recordingPage.rendered = function() {
  recording = this.data;
  console.log('Loading recording... ' + JSON.stringify(recording));

  // Get DOM elements
  mainVideoEl = document.getElementById('media-video');

  // Initialize editor
  editor = ace.edit('editor');
  setTimeout(function(){
    editor.setValue('');
  }, 3000);


  // Initialize popcorn instance
  $pop = Popcorn("#media-video");
  $pop.defaults('inception', {
    target: 'media-container'
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

  Player.init(recording.events[recording.events.length-1].timestamp);
}

function getSrcMedia(id) {
  var mediaList = recording.sources;
  var srcMedia = mediaList.filter(function(m) { return m.id === id; })[0];

  return srcMedia.file;
}

function getEndEvent(list, id) {
  return list.filter(function(p) {return (p.id == id && p.toDo == 'remove')})[0];
};

function syncMediaEvents(list) {
  var count = 0;

  _(list).each(function(e) {
    if(e.toDo == 'insert') {
      count++;
      var file = getSrcMedia(e.id);
      var endEvent = getEndEvent(list, e.id);

      download(file, function(srcVideo) {
        if (e.timestamp > 0) {
          $pop.inception({
            start: e.timestamp + 0.2,
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
