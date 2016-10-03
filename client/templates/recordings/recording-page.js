var mainVideoElement,
participantsContainerElement;
var editor;
var $pop;
var recording;

Template.recordingPage.created = function(){
  Session.set("document", Math.random().toString(36).substring(7));
}

Template.recordingPage.rendered = function(){
  recording = this.data;
  console.log('Loading recording... ' + JSON.stringify(recording));
  Session.set('loading', true);

  // Get DOM elements
  mainVideoElement = document.getElementById('main-video');

  // Initialize editor
  editor = ace.edit('editor');
  editor.setValue(' ');
  editor.getSession().getDocument().setValue("");
  editor.setReadOnly(true);
  console.log('Initialize editor...' + editor.getValue());

  // Initialize popcorn instance
  $pop = Popcorn("#main-video");
  $pop.defaults('inception', {
    target: 'chat__container'
  });

  mainVideoElement.onloadstart = function() {
    Session.set('loading', false);
  };

  // Listen for seeked event
  mainVideoElement.addEventListener('seeked', function(e) {
    editor.setValue('');

    var pos = this.currentTime;
    var listToDo = (pos)? (recording.RC[0]).filter(function(e) {
      return e.timestamp <= pos;
    }) : [];

    if (listToDo.length > 0) {
      updateSeek(listToDo);
    }

  }, false );

  syncEvents(recording.RC);
}

function updateSeek(list) {
  _(list).each(function(e) {
    if (e.toDo !== 'insertVideo' && e.toDo !== 'stopVideo'){
      var func = new Function('editor','arg', e.toDo);
      func(editor, e.arg);
    }
  });
};

function syncEvents(events) {
  //ejecutamos las funciones filtradas en el editor
  _(events[0]).each(function(e) {
    if (e.type){
      switch(e.type){
        case 'video':
          if(e.toDo == 'insertVideo') {
            var t = getUser(recording.videos, e.arg);

            var i = recording.videos.indexOf(t);
            if(i != -1) {
              recording.videos.splice(i, 1);
            }

            download(t.file, function(srcVideo) {
              if (e.timestamp > 0) {
                var stop = search(recording.RC, e.arg);
                var i = recording.RC[0].indexOf(stop);
                if(i != -1) {
                  recording.RC[0].splice(i, 1);
                }

                $pop.inception({
                  start: e.timestamp,
                  end: stop.timestamp,
                  source: srcVideo,
                  sync: true,
                  top: '0',
                  right: '0',
                  width: '35%'
                });
              } else {
                mainVideoElement.setAttribute('src', srcVideo);
              }
            })
          }

          break;
      }
    } else {
      $pop.cue(e.timestamp, function() {
        if(isPlaying(mainVideoElement)) {
          var func = new Function('editor', 'arg', e.toDo);
          func(editor, e.arg);
        }
      });
    }
  });
}

function getUser(r, id) {
  return r.filter(function(p) { return p.user === id; })[0];
}

function search(r, id) {
  return r[0].filter(function(p) {return (p.arg == id && p.toDo == 'stopVideo')})[0];
}

function isPlaying(video) {
  return !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
}

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
