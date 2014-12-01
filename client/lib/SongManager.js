
SongManager = {
  init: function(songId){
    this.dep = new Tracker.Dependency;
    this.setSongId(songId);
    this.setDate(new Date);
    this.setNotes([]);
  },
  setNotes: function(arg){
    this.notes = arg;
  },
  getNotes: function(){
    return this.notes;
  },
  addNote: function(note){
    var notes = this.getNotes();
    notes.push(note)
    this.setNotes(notes);
  },
  getSong: function(){
    return {
      _id: this.getSongId(),
      notes: this.getNotes(),
      date: this.getDate(),
    }
  },
  getSongId: function(){
    this.dep.depend();
    return this.songId;
  },
  setSongId: function(arg){
    this.songId = arg;
    this.dep.changed();
  },
  getDate: function(){
    return this.date;
  },
  setDate: function(arg){
    this.date = arg;
  },
};