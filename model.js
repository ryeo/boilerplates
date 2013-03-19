Boilerplates = new Meteor.Collection('boilerplates');
Tags = new Meteor.Collection('tags');

Meteor.methods({
  getCloneURL: function (boilerplateName) {
    var boilerplate = Boilerplates.findOne({ name: boilerplateName });
    if (! boilerplate) return '(null)';
    return boilerplate.cloneURL;
  }
});
