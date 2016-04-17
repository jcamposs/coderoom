var videoLocal;

Template.recordingPage.rendered = function(){
  videoLocal = document.getElementById('video-room__recorded');

  var r = this.data;
  console.log('record' + JSON.stringify(r));

  download(r.video_local, function(src) {
    videoLocal.src = src;
  });

  download(r.video_remote, function(src) {
    var container = document.createElement('div');
    container.className = 'video-room__participant video-room__participant--active';
    var v = document.createElement('video');
    v.src = src
    v.autoplay = true;
    container.appendChild(v);
    $('.video-room__participants').append(container);
  })
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
  console.log('Downloading');
}
