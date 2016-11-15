/**
 *   Copyright (C) 2016 Jorge Campos Serrano.
 *
 *   This program is free software: you can redistribute it and/or  modify
 *   it under the terms of the GNU Affero General Public License, version 3,
 *   as published by the Free Software Foundation.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Affero General Public License for more details.
 *
 *   You should have received a copy of the GNU Affero General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *   As a special exception, the copyright holders give permission to link the
 *   code of portions of this program with the OpenSSL library under certain
 *   conditions as described in each individual source file and distribute
 *   linked combinations including the program with the OpenSSL library. You
 *   must comply with the GNU Affero General Public License in all respects
 *   for all of the code used other than as permitted herein. If you modify
 *   file(s) with this exception, you may extend this exception to your
 *   version of the file(s), but you are not obligated to do so. If you do not
 *   wish to do so, delete this exception statement from your version. If you
 *   delete this exception statement from all source files in the program,
 *   then also delete it in the license file.
 */

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

function syncMedia(index, srcMedia, start, end, isMediaScreen) {
  if (srcMedia) {
    if (index === 0) {
      mainMedia.setAttribute('src', srcMedia);
    } else {
      if(isMediaScreen) {
        $pop.inception({
          start: start + 0.2,
          end: end,
          source: srcMedia,
          sync: true,
          background: 'black',
          height: '12.5rem',
          width: '100%',
          class: 'popcorn-inception-container--full'
        });
      } else {
        $pop.inception({
          start: start + 0.2,
          end: end,
          source: srcMedia,
          sync: true,
          position: 'absolute',
          bottom: '0px',
          right: '0px',
          margin: '.5rem',
          width: '30%'
        });
      }
    };
  } else {
    if (index === 0) {
      throwAlert('error', 'Recording is corrupted', 'alert-circle');
    } else {
      if(isMediaScreen) {
        $pop.image({
          start: start + 0.2,
          end: end,
          src: '/no-media-available.png',
          target: 'media__participants__container',
          class: 'container--full'
        });
      } else {
        $pop.image({
          start: start + 0.2,
          end: end,
          src: '/no-media-available.png',
          target: 'media__participants__container'
        });
      }
    };
  };
};

function syncEvents(sources, events) {
  var mediaEvents = searchMediaEvents(events);
  var defaultMedia = '';

  _(events).each(function(e, index) {
    switch(e.type) {
      case 'media':
        if(e.toDo === 'insert') {
          var sourceEv = searchSourceEvById(sources, e.id);
          var srcMedia = sourceEv ? sourceEv.src : defaultMedia;
          var endEvent = getEndEvent(mediaEvents, e.id);

          syncMedia(index, srcMedia, e.timestamp, endEvent.timestamp, e.mediaScreen);
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
