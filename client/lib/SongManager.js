
SongManager = {
  createSong: function(){
    // this.dep = new Tracker.Dependency;
    // this.setSongId(songId);
    // this.setDate(new Date);
    // this.setNotes([]);
    Meteor.call('createSong', function(err){
      if (err) console.log(err.reason);
    });
  },
  // reactive cursor
  getSongCursor: function(){
    return Songs.find({_id: this.getSongId()});
  },
  // setNotes: function(arg){
  //   // this.notes = arg;
  //   Session.set('notes', arg);
  // },
  // getNotes: function(){
  //   // return this.notes;
  //   return Session.get('notes');
  // },
  addNote: function(note){
    // var notes = this.getNotes();
    // notes.push(note)
    // this.setNotes(notes);
    Meteor.call('addNote', this.getSongId(), note, function(err){
      if (err) console.log(err.reason);
    });
  },
  // getSong: function(){
  //   return {
  //     _id: this.getSongId(),
  //     notes: this.getNotes(),
  //     date: this.getDate(),
  //   }
  // },
  getSongId: function(){
    // this.dep.depend();
    // return this.songId;
    return Session.get('songId');
  },
  setSongId: function(arg){
    // this.songId = arg;
    // this.dep.changed();
    Session.set('songId', arg);
  },
  // getDate: function(){
  //   return this.date;
  // },
  // setDate: function(arg){
  //   this.date = arg;
  // },
};