Meteor.startup(function () { Session.set('loading', true); });
Meteor.subscribe('tags');
Meteor.subscribe('boilerplates', function () { Session.set('loading', false); });

Meteor.Router.add({
  '/': 'main',
  '/boilerplates': 'boilerplates',
  '/boilerplates/:name': function (name) {
    if (! Boilerplates.findOne({ name: name })) { Meteor.Router.to('/boilerplates'); return 'boilerplates'; };
    Session.set('boilerplate', name);
    return 'detail';
  },
  '/add': function () {
    if (Meteor.user()) return 'add';
    Meteor.Router.to('/'); return 'main';
  }
});

Template.page.loading = function () { return Session.get('loading'); };

Template.main.mostUsed = function () {
  return Boilerplates.find({}, { sort: { uses: -1 } }).fetch().slice(0, 10);
};

Template.main.highestVoted = function () {
  return Boilerplates.find({}, { sort: { upvotes: -1 } }).fetch().slice(0, 10);
};

Template.main.count = function () { return Boilerplates.find().count(); };

Template.main.totalUpvotes = function () {
  var upvotes = 0;
  Boilerplates.find().forEach(function (bp) {
    upvotes += bp.upvotes;
  });
  return upvotes;
};

Template.main.totalDownvotes = function () {
  var downvotes = 0;
  Boilerplates.find().forEach(function (bp) {
    downvotes += bp.downvotes;
  });
  return downvotes;
};

Template.main.totalUses = function () {
  var uses = 0;
  Boilerplates.find().forEach(function (bp) {
    uses += bp.uses;
  });
  return uses;
};

Template.main.events({
  'click button.btn-success': function () {
    Meteor.loginWithGithub(function (err) {
      if (err) alert('An error occurred during the login process.');
    });
  },
  'click button.btn-danger': function () {
    Meteor.logout(function (err) {
      if (err) alert('An error occurred during the logout process.');
    });
  }
});

Template.topbar.events({
  'click a.logout': function () {
    Meteor.logout(function (err) {
      if (err) alert('An error occurred during the logout process.');
    });
  },
  'click a.login': function () {
    Meteor.loginWithGithub(function (err) {
      if (err) alert('An error occurred during the logout process.');
    });
  }
});

Template.boilerplates.boilerplates = function () {
  Session.setDefault('selectedTag', '');
  Session.setDefault('search', '');
  Session.setDefault('sort', ['name', 1]);
  var sort = {};
  sort[Session.get('sort')[0]] = Session.get('sort')[1];
  if (Boilerplates.find().fetch().length === 0) return;
  return Boilerplates.find({ tags: Session.get('selectedTag'),
                             name: { $regex: '.*' + Session.get('search') + '.*', $options: 'i' } },
                           { sort: sort });
};

Template.boilerplates.tags = function () {
  return Tags.find({}, { sort: { name: 1 } });
};

Template.detail.bp = function () {
  if (Boilerplates.find().fetch().length === 0) return;
  return Boilerplates.findOne({ name: Session.get('boilerplate') });
};

Template.detail.readme = function () {
  if (Boilerplates.find().fetch().length === 0) return;
  var bp = Boilerplates.findOne({ name: Session.get('boilerplate') });
  var rdm = 'Loading...';
  if (bp.readmeURL !== '') {
    Meteor.call('getREADME', bp.readmeURL, function (err, res) {
      rdm = res.content;
      $('.readme').html(marked(rdm));
    });
  } else {
    rdm = 'No README URL specified.';
  };
  return rdm;
};

Template.detail.events({
  'click button.btn-success': function () {
    if (! Meteor.user()) alert('You need to login to vote.');
    Boilerplates.update(Boilerplates.findOne({ name: Session.get('boilerplate') })._id, 
                        { $inc: { upvotes: 1 } });
  },
  'click button.btn-danger': function () {
    if (! Meteor.user()) alert('You need to login to vote.');
    Boilerplates.update(Boilerplates.findOne({ name: Session.get('boilerplate') })._id, 
                        { $inc: { upvotes: 1 } });
  }
});

Template.boilerplates.selectedTag = function () {
  if (Session.equals('selectedTag', this.name)) return 'active';
  return '';
};

Template.boilerplates.sort = function () {
  Session.setDefault('sort', ['name', 1]);
  var sort = {
    name: '',
    uses: '',
    upvotes: '',
    downvotes: ''
  };
  for (key in sort) {
    if (Session.get('sort')[0] === key) sort[key] = 'selectedSort';
  }
  return sort;
};

Template.add.events({
  'click button.btn-success': function () {
    var bptags = $('#bptags').val().split(' ');
    for (var i = 0; i < bptags.length; i++) {
      if (bptags[i] === ' ') bp.splice(i, 1);
    }
    if (bptags.indexOf('') === -1) bptags.push('');
    var bp = {
      name: $('#bpname').val(),
      cloneURL: $('#bpcloneurl').val(),
      readmeURL: $('#bpreadmeurl').val(),
      tags: bptags,
      uses: 0,
      upvotes: 0,
      downvotes: 0,
      user: Meteor.userId()
    };
    
    Meteor.call('verifyBoilerplate', bp, function (err, res) {
      if (! res.name) {
        alert('You either didn\'t supply a name, or this name is taken.'); return;
      };
      if (! res.cloneURL) {
        alert('You either didn\'t supply a clone URL, or this clone URL has been added.'); return;
      };
      for (var i = 0; i < bp.tags.length; i++) {
        var tag = Tags.findOne({ name: bp.tags[i] });
        if (! tag && bp.tags[i] !== '') {
          Tags.insert({ name: bp.tags[i] });
        };
      };
      if (bp.readmeURL !== '') bp.readmeURL = 'http://' + bp.readmeURL.split('://')[1];
      Boilerplates.insert(bp);
      Meteor.Router.to('/boilerplates');
    });
  }
});

Template.boilerplates.events({
  'click li.tag': function () {
    if (Session.equals('selectedTag', this.name)) {
      Session.set('selectedTag', ''); return;
    };
    Session.set('selectedTag', this.name);
  },
  'click th': function (event) {
    var text = $(event.target).text().toLowerCase();
    var order = -1;
    if (text === 'name') order = 1;
    Session.set('sort', [text, order]);
  },
  'keyup input': function () {
    Session.set('search', $('#search').val());
  }
});
