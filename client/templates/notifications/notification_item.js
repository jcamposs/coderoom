Template.notificationItem.events({
  'click .notification': function() {
    Notifications.update(this._id, {$set: {read: true}});
  }
});
