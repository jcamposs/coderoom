var mainVideoElement,
participantsContainerElement;
var editor;
var $pop;
var recording;

Template.recordingPage.rendered = function(){
  recording = this.data;
  console.log('Loading recording... ' + JSON.stringify(recording));

  $pop = Popcorn("#main-video");

  syncEvents(recording.RC);
}

function syncEvents(events) {
  //ejecutamos las funciones filtradas en el editor
  _(events[0]).each(function(e) {
    if (e.toDo){
      switch(e.toDo){
        case 'insertVideo':
          console.log(e)
          $pop.inception({
            start: e.timestamp,
            source: 'http://videos.mozilla.org/serv/webmademovies/atultroll.webm',
            sync: true,
            top: '10%',
            left: '40%',
            width: '35%'
          });

          break;
      }
    }
  });
}
