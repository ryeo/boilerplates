Boilerplates = new Meteor.Collection('boilerplates');
Tags = new Meteor.Collection('tags');

var Future = NodeModules.require('fibers/future');

Meteor.methods({
  getCloneURL: function (boilerplateName) {
    var boilerplate = Boilerplates.findOne({ name: boilerplateName });
    if (! boilerplate) return '(null)';
    return boilerplate.cloneURL;
  },
  getREADME: function (readmeURL) {
    this.unblock();
    var fut = new Future();
    Meteor.http.get(readmeURL, function (err, res) {
      fut.ret(res);
    });
    return fut.wait();
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
