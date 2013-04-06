Boilerplates = new Meteor.Collection('boilerplates');
Tags = new Meteor.Collection('tags');

Boilerplates.allow({
  insert: function (userId, doc) {
    var good = false;
    Meteor.call('verifyBoilerplate', doc, function (err, res) {
      if (doc.name && doc.cloneURL && res.name && res.cloneURL && res.userId) good = true;
    });
    return good;
  },
  remove: function (userId, doc) {
    return userId === doc.user;
  },
  update: function (userId, doc, fields, modifier) {
    return userId === doc.user;
  }
});

Tags.allow({
  insert: function (userId, doc) {
    return true;
  },
  update: function (userId, doc, fields, modifier) {
    if (modifier !== '$set') return false;
    var postChange = fields['name'];
    if (Boilerplates.findOne({ tags: postChange })) return true;
    return false;
  },
  remove: function (userId, doc) {
    return (! Boilerplates.finOne({ tags: doc.name }));
  }
});
