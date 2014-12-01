
Songs = new GroundDB('songs');

Meteor.methods({
  createSong: function(){
    var song = {
      notes: [],
      createdAt: new Date,
    }
    var songId = Songs.insert(song);
    if (this.isSimulation){
      SongManager.setSongId(songId);
      Router.go('song', {_id: songId});
    }
  },
  addNote: function(songId, note){
    Songs.update(songId, {
      $push: {notes: note},
    });
  },
  // updateNotes: function(song){
  //   Songs.update(song._id, {
  //     $set: {notes: song.notes},
  //   });
  // },
});