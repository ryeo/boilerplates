Boilerplates = new Meteor.Collection('boilerplates');
Tags = new Meteor.Collection('tags');

Meteor.methods({
  getCloneURL: function (boilerplateName) {
    var boilerplate = Boilerplates.findOne({ name: boilerplateName });
    if (! boilerplate) return '(null)';
    return boilerplate.cloneURL;
  },
  verifyBoilerplate: function (boilerplate) {
    var existentName = Boilerplates.findOne({ name: boilerplate.name });
    var existentCloneURL = Boilerplates.findOne({ cloneURL: boilerplate.cloneURL });
    var err = {
      name: (boilerplate.name !== '' && ! existentName),
      cloneURL: (boilerplate.cloneURL !== '' && ! existentCloneURL),
      userId: (boilerplate.user === this.userId)
    };
    return err;
  }
});
