Router.configure({
  waitOn: function(){
    return Meteor.subscribe('userData');
  }
});

Router.route('/', {
  name: 'home',
  layoutTemplate: 'layout',
  waitOn: function(){ return [Meteor.subscribe('rooms'), Meteor.subscribe('recordings')] }
});

 Router.route('/login', {
   name: 'login'
 });

 Router.route('/room/:_id',{
  name: 'room',
  layoutTemplate: 'layout_2',
  data: function(){ return Rooms.findOne(this.params._id) },
  waitOn: function(){ return [Meteor.subscribe('rooms')] }
});

 Router.route('/recordings',{
  name: 'recordingsList',
  layoutTemplate: 'layout',
  waitOn: function(){ return Meteor.subscribe('recordings') }
});

Router.route('/recordings/:_id',{
  name: 'recordingPage',
  layoutTemplate: 'layout_2',
  data: function(){ return Recordings.findOne(this.params._id) },
  waitOn: function(){ return Meteor.subscribe('recordings') }
});

 var requireLogin = function () {
  if (!Meteor.userId()) {
    Router.go('login');
  } else {
    this.next();
  }
};

//Users must be authenticated before access every route
Router.onBeforeAction(requireLogin, { except: ['login']});
