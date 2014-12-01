
Template.home.events({
  'click .chord': function(evt){
    var num = evt.currentTarget.dataset.num;
    num = parseInt(num);
    MIDI.ChordPlayer.playMaj(num);
    SongManager.addNote(num);
  },
  'click #new-song': function(){
    SongManager.init();
    Meteor.call('createSong', SongManager.getSong(), function(err, songId){
      if (err) {
        console.log(err.reason);
      } else {
        SongManager.setSongId(songId);
        Router.go('song', {_id: songId});
      }
    });
  },
  'click #save': function(){
    Meteor.call('updateSong', SongManager.getSong(), function(err){
      if (err) console.log(err.reason);
    });
  },
});

Template.home.helpers({
  songId: function(){
    SongManager.dep.depend();
    return SongManager.getSongId();
  },
});
