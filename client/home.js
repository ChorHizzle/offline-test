// Template.home.rendered = function(){
//   Tracker.autorun(function(){

//   });
// }

Template.home.events({
  'click .chord': function(evt){
    var num = evt.currentTarget.dataset.num;
    num = parseInt(num);
    MIDI.ChordPlayer.playMaj(num);
    SongManager.addNote(num);
  },
  'click #new-song': function(){
    SongManager.createSong();
    // Meteor.call('createSong', SongManager.getSong(), function(err, songId){
    //   if (err) console.log(err.reason);
    // });
  },
  // 'click #save': function(){
  //   Meteor.call('updateSong', SongManager.getSong(), function(err){
  //     if (err) console.log(err.reason);
  //   });
  // },
});

Template.home.helpers({
  songId: function(){
    // SongManager.dep.depend();
    return SongManager.getSongId();
  },
  notes: function() {
    var songCursor = SongManager.getSongCursor();
    if (songCursor){
      var songs = songCursor.fetch();
    console.log(songs)
      if (songs.length > 0) {
        var song = songs[0];
        return song.notes;
      }
    }
  },
});
