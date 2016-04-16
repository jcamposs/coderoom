var joinBtn,
    localVideo,
    localStreamstream;

Template.home.rendered = function () {
  joinBtn = document.querySelector('button.btn-js-join');
  localVideo = document.querySelector('video#video-room__local');
}

Template.home.events({
  'click .btn-js-join': function (e) {
    showSpinner(localVideo);
    join();
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
