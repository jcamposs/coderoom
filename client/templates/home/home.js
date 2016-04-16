var joinBtn,
    localVideo,
    localStreamstream;

var mediaRecorder,
    recordedBlobs,
    sourceBuffer;

Template.home.rendered = function () {
  Session.set("joined", false);
  Session.set("recording", false);
  Session.set("playing", false);

  joinBtn = document.querySelector('button.btn-js-join');
  localVideo = document.querySelector('video#video-room__local');
}

Template.home.helpers({
  joined: function () {
    return Session.get("joined");
  },
  recording: function () {
    return Session.get("recording");
  },
  playing: function () {
    return Session.get("playing");
  }
});

Template.home.events({
  'click .btn-js-join': function (e) {
    showSpinner(localVideo);
    join();
  },
  'click .btn-js-record': function (e) {
    record();

    Session.set("recording", true);
  },
  'click .btn-js-stop': function (e) {
    stop();

    Session.set("recording", false);
  },
  'click .btn-js-play': function (e) {
    play();
  }
});

var webrtc;

function join() {
  var room = document.getElementById('room').value;

  // create our webrtc connection
  webrtc = new SimpleWebRTC({
    // the id/element dom element that will hold "our" video
    localVideoEl: 'video-room__local',
    // the id/element dom element that will hold remote videos
    remoteVideosEl: '',
    // immediately ask for camera access
    autoRequestMedia: true,
    debug: false,
    detectSpeakingEvents: true,
    autoAdjustMic: false
  });

  // when it's ready, join if we got a room from the URL
  webrtc.on('readyToCall', function () {
    // you can name it anything
    if (room) webrtc.joinRoom(room);

    Session.set("joined", true);
  });

  // we got access to the camera
  webrtc.on('localStream', function (stream) {
    localStream = stream;
  });
  // we did not get access to the camera
  webrtc.on('localMediaError', function (err) {
  });

  // a peer video has been added
  webrtc.on('videoAdded', function (video, peer) {
    var container = document.createElement('div');
    container.className = 'video-room__participant video-room__participant--active';
    container.id = 'container_' + webrtc.getDomId(peer);
    showSpinner(container);
    container.appendChild(video);
    $('.video-room__participants').append(container);
  });

  // a peer was removed
  webrtc.on('videoRemoved', function (video, peer) {
    console.log('video removed ', peer);
    var remotes = document.getElementsByClassName("video-room__participants");
    var el = document.getElementById('container_' + webrtc.getDomId(peer));
    if (remotes[0] && el) {
      remotes[0].removeChild(el);
    }
  });
}

// The nested try blocks will be simplified when Chrome 47 moves to Stable
function record() {
  var options = {mimeType: 'video/webm', bitsPerSecond: 100000};

  recordedBlobs = [];
  try {
    mediaRecorder = new MediaRecorder(localStream, options);
  } catch (e0) {
    console.log('Unable to create MediaRecorder with options Object: ', e0);
    try {
      options = {mimeType: 'video/webm,codecs=vp9', bitsPerSecond: 100000};
      mediaRecorder = new MediaRecorder(localStream, options);
    } catch (e1) {
      console.log('Unable to create MediaRecorder with options Object: ', e1);
      try {
        options = 'video/vp8'; // Chrome 47
        mediaRecorder = new MediaRecorder(localStream, options);
      } catch (e2) {
        alert('MediaRecorder is not supported by this browser.\n\n' +
            'Try Firefox 29 or later, or Chrome 47 or later, with Enable experimental Web Platform features enabled from chrome://flags.');
        console.error('Exception while creating MediaRecorder:', e2);
        return;
      }
    }
  }
  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);

  mediaRecorder.onstop = handleStop;
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start(10); // collect 10ms of data
  console.log('MediaRecorder started', mediaRecorder);
}

function stop() {
  mediaRecorder.stop();
  console.log('Recorded Blobs: ', recordedBlobs);
  Session.set("playing", true);
}

function play() {
  var videoElement = document.querySelector('video#video-room__recorded');
  var superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
  videoElement.src = window.URL.createObjectURL(superBuffer);
  videoElement.controls = true;
}

function handleDataAvailable(event) {
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function handleStop(event) {
  console.log('Recorder stopped: ', event);
}

function showSpinner() {
  for (var i = 0; i < arguments.length; i++) {
    arguments[i].poster = 'transparent-1px.png';
    arguments[i].style.background = "center transparent url('spinner.gif') no-repeat";
  }
}

function hideSpinner() {
  for (var i = 0; i < arguments.length; i++) {
    arguments[i].src = '';
    arguments[i].poster = 'webrtc.png';
    arguments[i].style.background = '';
  }
}
