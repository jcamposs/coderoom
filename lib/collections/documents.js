Documents = new Mongo.Collection("documents");

Meteor.methods({
  insertDocument: function(d) {
    var id = Documents.insert(d);
    console.log("Added document with id " + id);
    return id
  },
  deleteDocument: function(id) {
    Documents.remove(id);
    if (!this.isSimulation) {
      ShareJS.model.delete(id);
    }
  }
});
