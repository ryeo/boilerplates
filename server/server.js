Accounts.loginServiceConfiguration.remove({ service: 'github' });
Accounts.loginServiceConfiguration.insert({
  service: 'github',
  clientId: 'a55f1d5187a91fc3549b',
  secret: 'e2f200063d9c9d78448b6147a4ef84b5f2c625e5'
});

Meteor.methods({
  getCloneURL: function (boilerplateName) {
    var boilerplate = Boilerplates.findOne({ name: boilerplateName });
    if (! boilerplate) return '(null)';
    return boilerplate.cloneURL;
  },
  getREADME: function (readmeURL) {
    return Meteor.http.get(readmeURL);
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
