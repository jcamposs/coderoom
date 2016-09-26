Router.configure({
  waitOn: function(){
    return Meteor.subscribe('userData');
  }
});

Router.route('/', function () {
  this.layout('layout');
  this.render('home');
});

 Router.route('/login', {
   name: 'login'
 });

 Router.route('/room/:name',{
  name: 'room',
  layoutTemplate: 'layout',
  data: function(){ return this.params.name },
  waitOn: function(){ return [Meteor.subscribe('recordings'), Meteor.subscribe('rooms')] }
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

//Users must be authenticated before access every route
Router.onBeforeAction(requireLogin, { except: ['login']});
