Notifications = new Mongo.Collection('notifications');

Meteor.methods ({
  createNotification: function(ntf) {
    var notificationId = Notifications.insert({
      userId: ntf.receiver,
      sender: ntf.sender,
      img: ntf.img,
      urlToContent: ntf.urlToContent,
      content: ntf.content,
      read: false
    });

    return notificationId;
  }
});
