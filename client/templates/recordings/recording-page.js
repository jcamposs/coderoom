var videoLocal;

Template.recordingPage.rendered = function(){
  videoLocal = document.getElementById('video-room__recorded');

  var r = this.data;
  console.log('record' + JSON.stringify(r));

  var videos = r.videos;
  videos.forEach(function(video) {
    if (video.user !== Meteor.user().services.google.email) {
      download(video.file, function(src) {
        var container = document.createElement('div');
        container.className = 'video-room__participant video-room__participant--active';
        var v = document.createElement('video');
        v.src = src
        v.autoplay = true;
        container.appendChild(v);
        $('.video-room__participants').append(container);
      })
    } else {
      download(video.file, function(src) {
        videoLocal.src = src;
      });
    }
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
  console.log('Downloading');
}
