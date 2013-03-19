Meteor.Router.add({
  '/': 'main',
  '/boilerplates': 'boilerplates',
  '/boilerplates/:bpname': function (bpname) {
    var id = Boilerplates.findOne({ name: bpname })._id;
    Session.set('boilerplate', id);
    return 'detail';
  }
});

Meteor.startup(function () {
  Session.set('selectedTag', '');
});

Template.boilerplates.boilerplates = function () {
  return Boilerplates.find({ tags: Session.get('selectedTag') }, { sort: { name: 1 } });
}

Template.boilerplates.tags = function () {
  return Tags.find({}, { sort: { name: 1 } });
}

Template.detail.bpname = function () {
  var id = Session.get('boilerplate');
  Session.set('boilerplate', '');
  return Boilerplates.findOne(id).name;
}

Template.boilerplates.selectedTag = function () {
  if (Session.equals('selectedTag', this._id)) return 'active';
  return '';
}

Template.boilerplates.events({
  'click li.tag': function () {
    if (Session.equals('selectedTag', this._id)) {
      Session.set('selectedTag', ''); return;
    }
    Session.set('selectedTag', this._id);
  }
});
