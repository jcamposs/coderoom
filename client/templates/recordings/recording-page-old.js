var mainVideoElement,
participantsContainerElement;
var editor;
var $pop;
var recording;

// Template.recordingPageOld.rendered = function(){
//   recording = this.data;
//   console.log('Loading recording... ' + JSON.stringify(recording));
//
//   // Get DOM elements
//   mainVideoElement = document.getElementById('main-video');
//   mainVideoElement.onplaying = function() {
//     editor.getSession().getDocument().setValue("");
//     $pop.play();
//   };
//   participantsContainerElement = document.getElementsByClassName("video-room__participants")[0];
//   participantsContainerElement.style.visibility='hidden';
//
//   // Initialize editor
//   editor = ace.edit('editor');
//   editor.getSession().getDocument().setValue("");
//   console.log('Initialize editor...');
//
//   $pop = Popcorn("#main-video");
//
//   // Recording videos
//   var videos = recording.videos;
//   var mainVideo = videos.find(isMain);
//   var participantsVideos = videos.filter(isParticipant);
//
//   // Download main video
//   download(mainVideo.file, function(src) {
//     mainVideoElement.src = src;
//
//     syncEditor();
//
//     var participantsProcessed = 0;
//     // Download participants Videos
//     participantsVideos.forEach(function(video) {
//       download(video.file, function(srcVideo) {
//         addParticipant(srcVideo);
//         participantsProcessed++;
//
//         if(participantsProcessed === participantsVideos.length) {
//           syncMedia();
//           participantsContainerElement.style.visibility='visible';
//         }
//       })
//     });
//   });
// }

function isMain(video) {
  return video.user == Meteor.user().services.google.email;
}

function isParticipant(video) {
  return video.user != Meteor.user().services.google.email;
}

function addParticipant(srcVideo) {
  var container = document.createElement('div');
  container.className = 'video-room__participant';
  var videoElement = document.createElement('video');
  videoElement.src = srcVideo;
  videoElement.className = "participant";
  container.appendChild(videoElement);
  $('.video-room__participants').append(container);
}

function syncMedia() {
  var streams = {
    a: $pop,
    b: Popcorn(".participant")
  }

  loadCount = 0,
  events = "play pause timeupdate seeking".split(/\s+/g);
  //sync(streams);
  // iterate both media sources
  Popcorn.forEach( streams, function( media, type ) {
    // when each is ready...
    media.on( "canplayall", function() {
      // trigger a custom "sync" event
      this.emit("sync");
    // Listen for the custom sync event...
    }).on( "sync", function() {
      // Once both items are loaded, sync events
      if ( ++loadCount == 2 ) {
        streams.a.mute();
        // Iterate all events and trigger them on the video B
        // whenever they occur on the video A
        events.forEach(function( event ) {
          streams.a.on( event, function() {
            // Avoid overkill events, trigger timeupdate manually
            if ( event === "timeupdate" ) {
              if ( !this.media.paused ) {
                return;
              }
              streams.b.emit( "timeupdate" );
              return;
            }
            if ( event === "seeking" ) {
              streams.b.currentTime( this.currentTime() );
            }
            if ( event === "play" || event === "pause" ) {
              streams.b[ event ]();
           }
          });
        });
      }
    });
  });
}

function syncEditor() {
  //ejecutamos las funciones filtradas en el editor
  _(recording.RC).each(function(e){
    $pop.cue(e.timestamp, function() {
      switch(e.action){
        case 'insert':
          editor.getSession().getDocument().insertMergedLines(e.range.start, e.val);
          break;
        case 'remove':
          editor.getSession().getDocument().remove(e.range);
          break;
       }
    });
  });
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
