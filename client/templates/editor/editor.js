Meteor.subscribe("documents");

Template.editor.helpers({
  mode: function () {
    return Session.get("mode");
  },
  documents: function() {
    return Documents.find({});
  },
  docid: function () {
    return Session.get("document");
  },
  configAce: function () {
    return function(ace) {
      ace.setTheme('ace/theme/monokai')
      ace.setShowPrintMargin(false)
      ace.getSession().setUseWrapMode(true)
      ace.$blockScrolling = Infinity;
    }
  }
});

Template.editor.events({
 'click .btn-js-new': function () {
    var date = new Date();
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    var doc = {
      title: "untitled1",
      username: Meteor.user().profile.name,
      created_on: date.toLocaleDateString('en-US', options)
    }

    Meteor.call('insertDocument', doc, function(err, result){
      if (result){
        Session.set("document", result);
      }
    });
  },
  'click a': function (e) {
    var docid = $(e.target).attr("data-id");
    Session.set("document", docid);
  }
});
