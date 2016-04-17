Router.configure({
  waitOn: function(){
    return Meteor.subscribe('userData');
  }
});

Router.route('/', {
  name: 'home',
  layoutTemplate: 'layout',
  waitOn: function(){ return Meteor.subscribe('recordings') }
 });

 Router.route('/login', {
   name: 'login'
 });

 Router.route('/recordings',{
  name: 'recordingsList',
  layoutTemplate: 'layout',
  waitOn: function(){ return Meteor.subscribe('recordings') }
});

Router.route('/recordings/:_id',{
  name: 'recordingPage',
  layoutTemplate: 'layout',
  data: function(){ return Recordings.findOne(this.params._id) },
  waitOn: function(){ return Meteor.subscribe('recordings') }
});

 var requireLogin = function () {
  if (!Meteor.userId()) {
    this.render('login');
  } else {
    this.next();
  }
};

var goToDashboard = function(pause) {
  if (Meteor.user()) {
    Router.go('/');
  } else {
    this.next();
  }
};

Router.onBeforeAction(requireLogin);
Router.onBeforeAction(goToDashboard, {only: ['login']});
