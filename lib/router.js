Router.configure({
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function(){
    return [
      Meteor.subscribe('userData'),
      Meteor.subscribe('allUsers'),
      Meteor.subscribe('notifications'),
      Meteor.subscribe('rooms'),
      Meteor.subscribe('recordings'),
      Meteor.subscribe('playlists')
    ];
  }
});

Router.route('/', {
  name: 'landingPage',
  onBeforeAction: function() {
    if (Meteor.user()) {
      Router.go('dashboardPage');
    } else {
      this.next();
    }
  }
});

Router.route('/dashboard', {
  name: 'dashboardPage',
  layoutTemplate: 'layout'
});

 Router.route('/login', {
   name: 'login'
 });

 Router.route('/room/:_id',{
  name: 'room',
  layoutTemplate: 'layout',
  data: function(){return Rooms.findOne(this.params._id);}
});

Router.route('/recordings/:_id',{
  name: 'recordingDetail',
  layoutTemplate: 'layout',
  data: function(){return Recordings.findOne(this.params._id);}
});

Router.route('/playlists',{
  name: 'playlistsPage',
  layoutTemplate: 'layout'
});

Router.route('/playlists/:_id',{
  name: 'playlistDetail',
  layoutTemplate: 'layout',
  data: function(){return Playlists.findOne(this.params._id);}
});

Router.route('/playlists/:_id/user/:_userId',{
  name: 'playlistDetailOwner',
  layoutTemplate: 'layout',
  data: function(){return Playlists.findOne(this.params._id);}
});

 var requireLogin = function () {
  if (!Meteor.userId()) {
    Router.go('login');
  } else {
    this.next();
  }
};

//Users must be authenticated before access every route
Router.onBeforeAction(requireLogin, { except: ['login', 'landingPage']});

Router.route('/(.*)',{
  name: 'notFound',
  layoutTemplate: 'layout'
});

Router.plugin('dataNotFound', {notFoundTemplate: 'notFound'});
