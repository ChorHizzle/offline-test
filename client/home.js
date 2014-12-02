
Template.home.events({
  'click #new-song': function(){
    SongManager.createSong();
  },
});

Template.home.helpers({
  song: function() {
    return SongManager.getSong();
  },
  songs: function(){
    return Songs.find({});
  },
});
