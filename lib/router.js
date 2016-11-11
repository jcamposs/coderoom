Router.configure({
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
  name: 'home'
});

Router.route('/dashboard', {
  name: 'dashboard',
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

Router.route('/recordings',{
  name: 'recordings',
  layoutTemplate: 'layout'
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
