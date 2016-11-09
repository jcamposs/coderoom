var $pop;
var mainMedia;
var editor;

Template.recordingDetail.created = function(){
  var defaultDoc = this.data._id + Meteor.userId();

  // Initialize session variables
  Session.set('isPlayback', true);
  Session.set('document', defaultDoc);
  Session.set('loadingMedia', true);
};

Template.recordingDetail.destroyed = function() {
  Player.destroy();

  // Reset session variables
  Session.set('isPlayback', false);
  Session.set('document', undefined);
  Session.set('loadingMedia', false);
};

Template.recordingDetail.rendered = function() {
  var recording = this.data;

  // Set recording title
  $('.header .content__title').html(recording.title);

  // Initialize popcorn instance
  $pop = Popcorn('#main-media');
  $pop.autoplay(false);
  $pop.defaults('inception', {
    target: 'media__participants__container'
  });

  // Initialize player
  Player.init(recording.duration-0.1);

  // Get DOM elements
  mainMedia = document.getElementById('main-media');
  editor = ace.edit('editor');

  // Set editor mode
  var editorMode = getModes().find(function(i) {
    return i.module === recording.editorMode;
  });
  setModeEditor(editorMode);

  // Listen for seeked event
  mainMedia.addEventListener('seeked', function() {
    // Reset editor and chat
    editor.setValue('');
    $('.chat__messages .chat__message').remove();

    // Search previous events to timestamp
    var pos = this.currentTime;
    var listToDo = (pos)? (recording.events).filter(function(e) {
      return e.timestamp <= pos;
    }) : [];

    // Exec previous events
    if (listToDo.length > 0) {
      updateSeek(listToDo);
    }
  }, false);

  downloadRecordingSources(recording, syncEvents);
};

function downloadRecordingSources(recording, callback) {
  var mediaArray = [];
  var sources = recording.sources;
  var numSources = sources.length;
  var loadedSources = 0;

  if (numSources > 0) {
    for (var i = 0; i < numSources; i++) {
      download(sources[i], function(idEv, srcMedia) {
        mediaArray.push({id: idEv, src: srcMedia});

        if(++loadedSources >= numSources) {
          callback(mediaArray, recording.events);
        }
      });
    }
  } else {
    // Almost moderator source
    throwAlert('error', 'Recording is corrupted', 'alert-circle');
    Session.set('loadingMedia', false);
  }
};

function searchSourceEvById(sources, id) {
  return sources.filter(function(s) {return s.id === id;})[0];
};

function searchMediaEvents(events) {
  return events.filter(function(e) {return e.type === 'media';});
};

function syncMedia(index, srcMedia, start, end, screenMedia) {
  if (index === 0) {
    if (srcMedia) {
      mainMedia.setAttribute('src', srcMedia);
    } else {
      throwAlert('error', 'Recording is corrupted', 'alert-circle');
    }
  } else {
    if(screenMedia) {
      $pop.inception({
        start: start + 0.2,
        end: end,
        source: srcMedia,
        sync: true,
        background: 'black',
        bottom: '0px',
        height: '12.5rem'
      });
    } else {
      $pop.inception({
        start: start + 0.2,
        end: end,
        source: srcMedia,
        sync: true,
        position: 'absolute',
        bottom: '0',
        right: '0',
        width: '35%'
      });
    }
  }
};

function syncEvents(sources, events) {
  var mediaEvents = searchMediaEvents(events);
  var defaultMedia = 'http://www.w3schools.com/html/mov_bbb.mp4';

  _(events).each(function(e, index) {
    switch(e.type) {
      case 'media':
        if(e.toDo === 'insert') {
          var sourceEv = searchSourceEvById(sources, e.id);
          var srcMedia = sourceEv ? sourceEv.src : defaultMedia;
          var endEvent = getEndEvent(mediaEvents, e.id);

          syncMedia(index, srcMedia, e.timestamp, endEvent.timestamp, e.arg2);
        }
        break;
      case 'editor':
        $pop.cue(e.timestamp, function() {
          var func = new Function('editor', 'arg', e.toDo);
          func(editor, e.arg);
        });
        break;
      case 'chat':
        $pop.cue(e.timestamp, function() {
          MediaManager.addMessage(e.arg, e.arg.remote);
        });
        break;
      default:
        throwAlert('error', 'Recording is corrupted', 'alert-circle');
    }
  });

  Session.set('loadingMedia', false);
}

function getEndEvent(list, id) {
  return list.filter(function(p) {return (p.id === id && p.toDo === 'remove');})[0];
};

function updateSeek(list) {
  _(list).each(function(e) {
    if (e.type === 'editor') {
      var func = new Function('editor', 'arg', e.toDo);
      func(editor, e.arg);
    } else if(e.type === 'chat') {
      MediaManager.addMessage(e.arg, e.arg.remote);
    }
  });
};

function download(source, callback) {
  var downloader = new GDriveDownloader({
    fileId: source.file,
    token: Meteor.user().services.google.accessToken,
    onComplete: function(data) {
      callback(source.id, data);
    },
    onError: function() {
      callback(source.id, undefined);
    }
  });

  // Download media
  downloader.download();
};
