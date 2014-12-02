
Template.song.created = function(){
  if (this.data) {
    var songId = this.data.songId;
    if (songId) {
      SongManager.init(songId); // where we subscribe
    }
  }
}

Template.song.events({
  'click .chord': function(evt){
    var num = evt.currentTarget.dataset.num;
    num = parseInt(num);
    MIDI.ChordPlayer.playMaj(num);
    SongManager.addNote(num);
  },
  'click #new-song': function(){
    SongManager.createSong();
  },
});

Template.song.helpers({
  song: function() {
    return SongManager.getSong();
  },
})

