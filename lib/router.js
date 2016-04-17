Router.route('/', {
  name: 'home',
  layoutTemplate: 'layout'
 });

 Router.route('/login', {
   name: 'login'
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
