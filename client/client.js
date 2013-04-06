Meteor.Router.add({
  '/': 'main',
  '/boilerplates': 'boilerplates',
  '/boilerplates/:name': function (name) {
    Session.set('boilerplate', name);
    console.log(Boilerplates.find().fetch());
    return 'detail';
  },
  '/add': 'add'
});

Template.main.mostUsed = function () {
  return Boilerplates.find({}, { sort: { uses: -1 } }).fetch().slice(0, 10);
}

Template.main.highestVoted = function () {
  return Boilerplates.find({}, { sort: { upvotes: -1 } }).fetch().slice(0, 10);
}

Template.main.count = function () { return Boilerplates.find().count(); }

Template.main.upvotes = function () {
  var upvotes = 0;
  Boilerplates.find().forEach(function (bp) {
    upvotes += bp.upvotes;
  });
  return upvotes;
}

Template.main.downvotes = function () {
  var downvotes = 0;
  Boilerplates.find().forEach(function (bp) {
    downvotes += bp.downvotes;
  });
  return downvotes;
}

Template.main.uses = function () {
  var uses = 0;
  Boilerplates.find().forEach(function (bp) {
    uses += bp.uses;
  });
  return uses;
}

Template.boilerplates.boilerplates = function () {
  Session.setDefault('selectedTag', '');
  return Boilerplates.find({ tags: Session.get('selectedTag') }, { sort: { name: 1 } });
}

Template.boilerplates.tags = function () {
  return Tags.find({}, { sort: { name: 1 } });
}

Template.detail.bp = function () {
  if (Boilerplates.find().fetch().length === 0) return;
  return Boilerplates.findOne({ name: Session.get('boilerplate') });
}

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
  }
  return rdm;
}

Template.detail.events({
  'click button.btn-success': function () {
    Boilerplates.update(Boilerplates.findOne({ name: Session.get('boilerplate') })._id, 
                        { $inc: { upvotes: 1 } });
  },
  'click button.btn-danger': function () {
    Boilerplates.update(Boilerplates.findOne({ name: Session.get('boilerplate') })._id, 
                        { $inc: { upvotes: 1 } });
  }
});

Template.boilerplates.selectedTag = function () {
  if (Session.equals('selectedTag', this.name)) return 'active';
  return '';
}

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
      }
      if (! res.cloneURL) {
        alert('You either didn\'t supply a clone URL, or this clone URL has been added.'); return;
      }
      for (var i = 0; i < bp.tags.length; i++) {
        var tag = Tags.findOne({ name: bp.tags[i] });
        if (! tag && bp.tags[i] !== '') {
          Tags.insert({ name: bp.tags[i] });
        }
      }
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
    }
    Session.set('selectedTag', this.name);
  }
});
