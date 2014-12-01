

if (typeof(MIDI) === "undefined") MIDI = {};
MIDI.keyToNote = {}; // C8  == 108
MIDI.noteToKey = {}; // 108 ==  C8
(function () {
  var A0 = 0x15; // first note (21)
  var C8 = 0x6C; // last note (108)
  var number2key = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
  for (var n = A0; n <= C8; n++) {
    var octave = (n - 12) / 12 >> 0;
    var name = number2key[n % 12] + octave;
    MIDI.keyToNote[name] = n;
    MIDI.noteToKey[n] = name;
  }
})();

MIDI.ChordPlayer = {
  increaseVolume: function(){
    var res = this.getVolume();
    this.setVolume(res + 0.1);
  },
  decreaseVolume: function(){
    if (this.gainNode.gain.value > 0) {
      var res = this.getVolume();
      this.setVolume(res - 0.1);
    }
  },
  getVolume: function(){
    this.volumeDep.depend();
    return this.gainNode.gain.value;
  },
  setVolume: function(arg){
    this.volumeDep.changed();
    this.gainNode.gain.value = arg;
  },
  init: function(){
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();
    this.volumeDep = new Tracker.Dependency;
    this.gainNode = this.ctx.createGain();
    // Connect the source to the gain node.
    // Connect the gain node to the destination.
    this.gainNode.connect(this.ctx.destination);
    this.gainNode.gain.value = 1.5;

    // caching the buffer
    this.bufferDict = {};
    var self = this;
    _.range(21, 109).forEach(function(noteNumber) {
      var key = MIDI.noteToKey[noteNumber];
      var base64 = MIDI.Soundfont.mp3.acoustic_grand_piano[key].split(",")[1];
      var buffer = Base64Binary.decodeArrayBuffer(base64);
      self.ctx.decodeAudioData(buffer, function(buffer){
        self.bufferDict[noteNumber] = buffer;
      });
    });      
  },
  play: function(noteNumber) {
    var source = this.ctx.createBufferSource(); // creates a sound source
    source.connect(this.gainNode);
    var buffer = this.bufferDict[noteNumber];
    if (buffer) {
      source.buffer = buffer;
      source.start(0);
    }
  },
  playMaj: function(noteNumber) {
    this.play(noteNumber);
    this.play(noteNumber + 16);
    this.play(noteNumber + 7);
  },
  
  playMajFlat5: function(noteNumber) {
    this.play(noteNumber);
    this.play(noteNumber + 16);
    this.play(noteNumber + 6);
  },
  playMin: function(noteNumber) {
    this.play(noteNumber);
    this.play(noteNumber + 15);
    this.play(noteNumber + 7);
  },
  playDim: function(noteNumber) {
    this.play(noteNumber);
    this.play(noteNumber + 15);
    this.play(noteNumber + 6);
  },

  playSus2: function(noteNumber) {
    this.play(noteNumber);
    this.play(noteNumber + 14);
    this.play(noteNumber + 7);
  },
  playSus4: function(noteNumber) {
    this.play(noteNumber);
    this.play(noteNumber + 17);
    this.play(noteNumber + 7);
  },
  playAug: function(noteNumber) {
    this.play(noteNumber);
    this.play(noteNumber + 16);
    this.play(noteNumber + 8);
  },
  playDom: function(noteNumber) {
    this.play(noteNumber);
    this.play(noteNumber + 16);
    this.play(noteNumber + 10);
  },


  playMaj1: function(noteNumber) {
    this.play(noteNumber);
    this.play(noteNumber - 12 + 7);
    this.play(noteNumber - 12 + 4 );
    this.play(noteNumber - 12);
    // this.play(noteNumber - 24);
  },
  playMaj3: function(noteNumber) {
    this.play(noteNumber);
    this.play(noteNumber - 16 + 7);
    this.play(noteNumber - 16);
  },
  playMaj5: function(noteNumber) {
    this.play(noteNumber);
    this.play(noteNumber - 7);
    this.play(noteNumber - 3 - 12);
  },
  playMin1: function(noteNumber) {
    this.play(noteNumber);
    this.play(noteNumber - 12 + 7);
    this.play(noteNumber - 12 + 3 );
    this.play(noteNumber - 12);
    // this.play(noteNumber - 24);
  },
  playMin3: function(noteNumber) {
    this.play(noteNumber);
    this.play(noteNumber - 15 + 7);
    this.play(noteNumber - 15);
  },
  playMin5: function(noteNumber) {
    this.play(noteNumber);
    this.play(noteNumber - 4);
    this.play(noteNumber - 19);
  },
  playDim3: function(noteNumber) {
    this.play(noteNumber);
    this.play(noteNumber - 3 - 12);
    this.play(noteNumber - 6);
  }, 
  playSus3: function(noteNumber){
    this.play(noteNumber);
    this.play(noteNumber - 5 - 12);
    this.play(noteNumber - 10);
  },
}