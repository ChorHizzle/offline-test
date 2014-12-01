
Songs = new GroundDB('songs');

Meteor.methods({
  createSong: function(song){
    return Songs.insert(song);
  },
  addNote: function(){

  },
  updateSong: function(song){
    Songs.update(song._id, {
      $set: song,
    });
  },
});