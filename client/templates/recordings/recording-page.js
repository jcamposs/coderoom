var mainVideoEl;
var editor;
var $pop;
var recording;

Template.recordingPage.created = function(){
  var defaultDoc = this.data._id;
  Session.set('document', defaultDoc);

  Session.set('loadingMedia', true);
};

Template.recordingPage.destroyed = function() {
  Player.destroy();
};

Template.recordingPage.helpers({
  recordingName: function() {
    return Session.get('recordingName');
  }
});

Template.recordingPage.rendered = function() {
  recording = this.data;
  Session.set('recordingName', recording.title);
  console.log('Loading recording... ' + JSON.stringify(recording));

  // Get DOM elements
  mainVideoEl = document.getElementById('media-video');

  // Initialize editor
  editor = ace.edit('editor');
  setTimeout(function(){
    editor.setValue('');
    Session.set('loadedEditor', true);
  }, 3000);


  // Initialize popcorn instance
  $pop = Popcorn("#media-video");
  $pop.defaults('inception', {
    target: 'media-container'
  });

  // Listen for seeked event
  mainVideoEl.addEventListener('seeked', function() {
    editor.setValue('');

    var pos = this.currentTime;
    var listToDo = (pos)? (recording.events).filter(function(e) {
      return e.timestamp <= pos;
    }) : [];

    if (listToDo.length > 0) {
      updateSeek(listToDo);
    }

  }, false );

  downloadSources(recording.sources, syncEvents);

  Player.init(recording.events[recording.events.length-1].timestamp-0.1);
};

function downloadSources(sources, callback) {
  var mediaArray = [];
  var loadedSources = 0;
  var numSources = sources.length;

  if (numSources > 0) {
    for (var i = 0; i < numSources; i++) {
      download(sources[i], function(idEv, srcMedia) {
        mediaArray.push({id: idEv, src: srcMedia});

        if(++loadedSources >= numSources) {
          callback(mediaArray);
        }
      });
    }
  } else {
    // Almost moderator source
    throwAlert('error', 'Recording is corrupted', 'alert-circle');
    Session.set('loadingMedia', false);
  }

}

function syncEvents(sources) {
  var mediaEvents = recording.events.filter(function(e) {
    return e.type === 'media';
  });

  _(recording.events).each(function(e, index) {
    switch(e.type) {
      case 'media':
        if(e.toDo === 'insert') {
          var mediaEv = sources.filter(function(m) { return m.id === e.id; })[0];
          var srcVideo = mediaEv ? mediaEv.src : 'http://www.w3schools.com/html/mov_bbb.mp4';
          var endEvent = getEndEvent(mediaEvents, e.id);

          if (index === 0) {
            mainVideoEl.setAttribute('src', srcVideo);
          } else {
            $pop.inception({
              start: e.timestamp + 0.2,
              end: endEvent.timestamp,
              source: srcVideo,
              sync: true,
              top: '0',
              right: '0',
              width: '35%'
            });
          }
        }
        break;
      case 'text':
        $pop.cue(e.timestamp, function() {
          var func = new Function('editor', 'arg', e.toDo);
          func(editor, e.arg);
        });
        break;
    }
  });

  Session.set('loadingMedia', false);
}

function getEndEvent(list, id) {
  return list.filter(function(p) {return (p.id === id && p.toDo === 'remove')})[0];
};

function updateSeek(list) {
  _(list).each(function(e) {
    if (e.type === 'text') {
      var func = new Function('editor', 'arg', e.toDo);
      func(editor, e.arg);
    }
  });
};

function download(source, callback) {
  var downloader = new GDriveDownloader({
    fileId: source.file,
    token: Meteor.user().services.google.accessToken,
    onComplete: function(data) {
      console.log('blob: ' + data);
      callback(source.id, data);
    },
    onError: function(e) {
      callback(source.id, undefined);
    }
  });

  // Upload video
  downloader.download();
  console.log('Downloading ' + source.file);
}
