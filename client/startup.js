Meteor.startup(function(){
  MIDI.ChordPlayer.init();
  SongManager.subscribeAll();
});