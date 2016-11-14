Router.configure({
  notFoundTemplate: 'NotFound',
  waitOn: function(){
    return [
      Meteor.subscribe('userData'),
      Meteor.subscribe('allUsers'),
      Meteor.subscribe('notifications'),
      Meteor.subscribe('rooms'),
      Meteor.subscribe('recordings')
    ];
  }
});

Router.route('/', {
  name: 'home',
  loadingTemplate: 'spinner',
  onBeforeAction: function() {
    if (Meteor.user()) {
      Router.go('dashboard');
    } else {
      this.next();
    }
  }
});

Router.route('/dashboard', {
  name: 'dashboard',
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

 Router.route('/login', {
   name: 'login'
 });

 Router.route('/room/:_id',{
  name: 'room',
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  data: function(){return Rooms.findOne(this.params._id);},
  onRun: function() {
    if(this.data() === undefined) {
      this.render('notFound');
    } else {
      this.next();
    }
  }
});

Router.route('/recordings/:_id',{
  name: 'recordingDetail',
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  data: function(){return Recordings.findOne(this.params._id);},
  onBeforeAction: function() {
    if(this.data() === undefined) {
      this.render('notFound');
    } else {
      this.next();
    }
  }
});

Router.route('/recordings',{
  name: 'recordings',
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

 var requireLogin = function () {
  if (!Meteor.userId()) {
    Router.go('login');
  } else {
    this.next();
  }
};

//Users must be authenticated before access every route
Router.onBeforeAction(requireLogin, { except: ['login', 'home']});

Router.route('/(.*)',{
  name: 'notFound',
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});
