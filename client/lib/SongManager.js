
SongManager = {
  song: new ReactiveVar(),
  songId: new ReactiveVar(),

  createSong: function(){
    Meteor.call('createSong', function(err){
      if (err) console.log(err.reason);
    });
  },

  subscribeAll: function(){
    Meteor.subscribe('allSongs');
  },

  init: function(songId) {
    this.setSongId(songId);
    this.computation = Tracker.autorun(_.bind(this.update, this));
  },
  stop: function(){
    this.computation.stop();
  },

  update: function(){
    var songId = this.getSongId();
    Meteor.subscribe('song', songId);
    this.setSong(Songs.findOne(songId));
  },
  addNote: function(note){
    Meteor.call('addNote', this.getSongId(), note, function(err){
      if (err) console.log(err.reason);
    });
  },
  getSongId: function(){
    return this.songId.get();
  },
  setSongId: function(arg){
    this.songId.set(arg);
  },
  getSong: function(){
    return this.song.get();
  },
  setSong: function(arg){
    this.song.set(arg);
  },
};