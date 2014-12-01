
if (typeof(MIDI) === "undefined") MIDI = {};

MIDI.MelodicChord = {
  getNoteNumber: function(letter, shift){
    return MIDI.keyToNote[letter] + shift;
  },
  play: function(letter, shift){
    var noteNumber = MIDI.keyToNote[letter] + shift;

    if (noteNumber < 21) {
      noteNumber += 12;
    } else if (noteNumber > 107) {
      noteNumber -= 12;
    }
    MIDI.ChordPlayer.play(noteNumber);
  },

  getFlatSpelling: function(noteNumber) {
    var letters = MIDI.noteToKey[noteNumber];
    letters = letters.slice(0, letters.length - 1);
    return letters.replace('b', '\u266D');
  },

  getRoot: function(noteNumber) {
    var spelling = this.getFlatSpelling(noteNumber);
    var ret = {
      noteNumbers: [noteNumber],
      message: spelling + '\n_',
      configuration: [{x: 0, y: 0, spelling: spelling}],
    };
    return ret;
  },

  getMaj1: function(noteNumber) {
    var topLetter = 'C5';
    var bottomLetter = 'C3'
    var diff = noteNumber - MIDI.keyToNote[topLetter];
    var noteNumbers = [];
    noteNumbers.push(this.getNoteNumber(topLetter, diff));
    noteNumbers.push(this.getNoteNumber('E4', diff));
    noteNumbers.push(this.getNoteNumber('G3', diff));
    noteNumbers.push(this.getNoteNumber(bottomLetter, diff));

    var shiftedBottom = this.getFlatSpelling(this.getNoteNumber(bottomLetter, diff));
    var shifted3 = this.getCorrectSpelling(this.getNoteNumber('E4', diff), shiftedBottom, 3);
    var shifted5 = this.getCorrectSpelling(this.getNoteNumber('G4', diff), shiftedBottom, 5);
    var shiftedTop = shiftedBottom;
    var message = shiftedTop + '\n';
    message += shiftedBottom  + 'maj1'; 
    return {
      noteNumbers: noteNumbers,
      message: message,
      configuration: [
        {x: 0, y: 0, isRoot: true, spelling: shiftedBottom},
        {x: -1, y: 1, spelling: shifted5},
        {x: -2, y: 0, spelling: shifted3},
      ],
    };
  },
  getMaj3: function(noteNumber) {
    var topLetter = 'E4'
    var bottomLetter = 'C3'
    var diff = noteNumber - MIDI.keyToNote[topLetter];
    var noteNumbers = [];
    noteNumbers.push(this.getNoteNumber(topLetter, diff));
    noteNumbers.push(this.getNoteNumber('C4', diff));
    noteNumbers.push(this.getNoteNumber('G3', diff));
    noteNumbers.push(this.getNoteNumber(bottomLetter, diff));

    var shiftedBottom = this.getFlatSpelling(this.getNoteNumber(bottomLetter, diff));
    var shifted3 = this.getCorrectSpelling(this.getNoteNumber('E4', diff), shiftedBottom, 3);
    var shifted5 = this.getCorrectSpelling(this.getNoteNumber('G4', diff), shiftedBottom, 5);
    var shiftedTop = shifted3;
    var message = shiftedTop + '\n';
    message += shiftedBottom  + 'maj3'; 
    
    return {
      noteNumbers: noteNumbers,
      message: message,
      configuration: [
        {x: 0, y: 0, spelling: shifted3},
        {x: -1, y: 0, isRoot: true, spelling: shiftedBottom},
        {x: -2, y: 1, spelling: shifted5},
      ],
    };
  },
  // bass note is the 3rd
  getMaj5: function(noteNumber) {
    var topLetter = 'G4'
    var bottomLetter = 'C3'
    var diff = noteNumber - MIDI.keyToNote[topLetter];
    var noteNumbers = [];
    noteNumbers.push(this.getNoteNumber(topLetter, diff));
    noteNumbers.push(this.getNoteNumber('E4', diff));
    noteNumbers.push(this.getNoteNumber('C4', diff));
    noteNumbers.push(this.getNoteNumber(bottomLetter, diff));
    
    var shiftedBottom = this.getFlatSpelling(this.getNoteNumber(bottomLetter, diff));
    var shifted3 = this.getCorrectSpelling(this.getNoteNumber('E4', diff), shiftedBottom, 3);
    var shifted5 = this.getCorrectSpelling(this.getNoteNumber(topLetter, diff), shiftedBottom, 5);
    var shiftedTop = shifted5;
    var message = shiftedTop + '\n';
    message += shiftedBottom  + 'maj5';

    return {
      noteNumbers: noteNumbers,
      message: message,
      configuration: [
        {x: 0, y: 0, spelling: shifted5},
        {x: -1, y: -1, spelling: shifted3},
        {x: -2, y: -1, isRoot: true, spelling: shiftedBottom},
      ],
    };
  },
  getMaj6: function(noteNumber) {
    var topLetter = 'A4';
    var bottomLetter = 'C3';
    var diff = noteNumber - MIDI.keyToNote[topLetter];
    var noteNumbers = [];
    noteNumbers.push(this.getNoteNumber(topLetter, diff));
    noteNumbers.push(this.getNoteNumber('G3', diff));
    noteNumbers.push(this.getNoteNumber('E4', diff));
    noteNumbers.push(this.getNoteNumber(bottomLetter, diff));

    var shiftedBottom = this.getFlatSpelling(this.getNoteNumber(bottomLetter, diff));
    var shifted3 = this.getCorrectSpelling(this.getNoteNumber('E4', diff), shiftedBottom, 3);
    var shifted5 = this.getCorrectSpelling(this.getNoteNumber('G3', diff), shiftedBottom, 5);
    var shiftedTop = this.getCorrectSpelling(this.getNoteNumber(topLetter, diff), shiftedBottom, 6);
    var message = shiftedTop + '\n';
    message += shiftedBottom  + 'maj6'; 
    
    return {
      noteNumbers: noteNumbers,
      message: message,
      configuration: [
        {x: 0, y: 0, spelling: shiftedTop},
        {x: -1, y: -2, spelling: shifted5},
        {x: -2, y: -3, spelling: shifted3},
        {x: -3, y: -3, isRoot: true, spelling: shiftedBottom},
      ],
    };
  },
  getMaj7: function(noteNumber) {
    var topLetter = 'B4';
    var bottomLetter = 'C3';
    var diff = noteNumber - MIDI.keyToNote[topLetter];
    var noteNumbers = [];
    noteNumbers.push(this.getNoteNumber(topLetter, diff));
    noteNumbers.push(this.getNoteNumber('G4', diff));
    noteNumbers.push(this.getNoteNumber('E4', diff));
    noteNumbers.push(this.getNoteNumber(bottomLetter, diff));

    var shiftedBottom = this.getFlatSpelling(this.getNoteNumber(bottomLetter, diff));
    var shifted3 = this.getCorrectSpelling(this.getNoteNumber('E4', diff), shiftedBottom, 3);
    var shifted5 = this.getCorrectSpelling(this.getNoteNumber('G4', diff), shiftedBottom, 5);
    var shiftedTop = this.getCorrectSpelling(this.getNoteNumber(topLetter, diff), shiftedBottom, 7);
    var message = shiftedTop + '\n';
    message += shiftedBottom  + 'maj7'; 
    
    return {
      noteNumbers: noteNumbers,
      message: message,
      configuration: [
        {x: 0, y: 0, spelling: shiftedTop},
        {x: -1, y: 0, spelling: shifted5},
        {x: -2, y: -1, spelling: shifted3},
        {x: -3, y: -1, isRoot: true, spelling: shiftedBottom},
      ],
    };
  },
  // closed; ~ maj6,9 
  getSus2: function(noteNumber) {
    var topLetter = 'D5';
    var bottomLetter = 'C3';
    var diff = noteNumber - MIDI.keyToNote[topLetter];
    var noteNumbers = [];
    noteNumbers.push(this.getNoteNumber(topLetter, diff));
    noteNumbers.push(this.getNoteNumber('G4', diff));
    noteNumbers.push(this.getNoteNumber('E4', diff));
    noteNumbers.push(this.getNoteNumber(bottomLetter, diff));

    var shiftedBottom = this.getFlatSpelling(this.getNoteNumber(bottomLetter, diff));
    var shifted3 = this.getCorrectSpelling(this.getNoteNumber('E4', diff), shiftedBottom, 3);
    var shifted5 = this.getCorrectSpelling(this.getNoteNumber('G4', diff), shiftedBottom, 5);
    var shiftedTop = this.getCorrectSpelling(this.getNoteNumber(topLetter, diff), shiftedBottom, 2);
    var message = shiftedTop + '\n';
    message += shiftedBottom  + 'sus2'; 
    
    return {
      noteNumbers: noteNumbers,
      message: message,
      configuration: [
        {x: 0, y: 0, spelling: shiftedTop},
        {x: -1, y: -2, isRoot: true, spelling: shiftedBottom},
        {x: -2, y: -1, spelling: shifted5},
        {x: -3, y: -2, spelling: shifted3},
      ],
    };
  },
  getSus4: function(noteNumber) {
    var topLetter = 'F4';
    var bottomLetter = 'C3';
    var diff = noteNumber - MIDI.keyToNote[topLetter];
    var noteNumbers = [];
    noteNumbers.push(this.getNoteNumber(topLetter, diff));
    noteNumbers.push(this.getNoteNumber('G3', diff));
    noteNumbers.push(this.getNoteNumber(bottomLetter, diff));

    var shiftedBottom = this.getFlatSpelling(this.getNoteNumber(bottomLetter, diff));
    var shifted5 = this.getCorrectSpelling(this.getNoteNumber('G3', diff), shiftedBottom, 5);
    var shiftedTop = this.getCorrectSpelling(this.getNoteNumber(topLetter, diff), shiftedBottom, 4);
    var message = shiftedTop + '\n';
    message += shiftedBottom  + 'sus4'; 
    
    return {
      noteNumbers: noteNumbers,
      message: message,
      configuration: [
        {x: 0, y: 0, spelling: shiftedTop},
        {x: -1, y: 1, isRoot: true, spelling: shiftedBottom},
        {x: -2, y: 2, spelling: shifted5},
      ],
    };
  },
  getSharp4: function(noteNumber) {
    var topLetter = 'B4'
    var bottomLetter = 'F3';
    var diff = noteNumber - MIDI.keyToNote[topLetter];
    var noteNumbers = [];
    noteNumbers.push(this.getNoteNumber(topLetter, diff));
    noteNumbers.push(this.getNoteNumber('C4', diff));
    noteNumbers.push(this.getNoteNumber('A3', diff));
    noteNumbers.push(this.getNoteNumber(bottomLetter, diff));

    var shiftedBottom = this.getFlatSpelling(this.getNoteNumber(bottomLetter, diff));
    var shifted3 = this.getCorrectSpelling(this.getNoteNumber('A3', diff), shiftedBottom, 3);
    var shifted5 = this.getCorrectSpelling(this.getNoteNumber('C4', diff), shiftedBottom, 5);
    var shiftedTop = this.getCorrectSpelling(this.getNoteNumber(topLetter, diff), shiftedBottom, 4);
    var message = shiftedTop + '\n';
    message += shiftedBottom  + 'maj#11'; 
    
    return {
      noteNumbers: noteNumbers,
      message: message,
      configuration: [
        {x: 0, y: 0, spelling: shiftedTop},
        {x: -1, y: -2, spelling: shifted3},
        {x: -2, y: -2, isRoot: true, spelling: shiftedBottom},
        {x: -3, y: -1, spelling: shifted5},
      ],
    };
  },

  getMin1: function(noteNumber) {
    var topLetter = 'A5'
    var bottomLetter = 'A3';
    var diff = noteNumber - MIDI.keyToNote[topLetter];
    var noteNumbers = [];
    noteNumbers.push(this.getNoteNumber(topLetter, diff));
    noteNumbers.push(this.getNoteNumber('C5', diff));
    noteNumbers.push(this.getNoteNumber('E4', diff));
    noteNumbers.push(this.getNoteNumber(bottomLetter, diff));

    var shiftedBottom = this.getFlatSpelling(this.getNoteNumber(bottomLetter, diff));
    var shifted3 = this.getCorrectSpelling(this.getNoteNumber('C5', diff), shiftedBottom, 3);
    var shifted5 = this.getCorrectSpelling(this.getNoteNumber('E4', diff), shiftedBottom, 5);
    var shiftedTop = shiftedBottom;
    var message = shiftedTop + '\n';
    message += shiftedBottom  + 'min1'; 
    
    return {
      noteNumbers: noteNumbers,
      message: message,
      configuration: [
        {x: 0, y: 0, isRoot: true, spelling: shiftedBottom},
        {x: -1, y: 1, spelling: shifted5},
        {x: -2, y: 1, spelling: shifted3},
      ],
    };
  },
  getMin3: function(noteNumber) {
    var topLetter = 'C5'
    var bottomLetter = 'A3';
    var diff = noteNumber - MIDI.keyToNote[topLetter];
    var noteNumbers = [];
    noteNumbers.push(this.getNoteNumber(topLetter, diff));
    noteNumbers.push(this.getNoteNumber('A4', diff));
    noteNumbers.push(this.getNoteNumber('E4', diff));
    noteNumbers.push(this.getNoteNumber(bottomLetter, diff));

    var shiftedBottom = this.getFlatSpelling(this.getNoteNumber(bottomLetter, diff));
    var shifted5 = this.getCorrectSpelling(this.getNoteNumber('E4', diff), shiftedBottom, 5);
    var shiftedTop = this.getCorrectSpelling(this.getNoteNumber(topLetter, diff), shiftedBottom, 3);
    var message = shiftedTop + '\n';
    message += shiftedBottom  + 'min3';
    
    return {
      noteNumbers: noteNumbers,
      message: message,
      configuration: [
        {x: 0, y: 0, spelling: shiftedTop},
        {x: -1, y: -1, isRoot: true, spelling: shiftedBottom},
        {x: -2, y: 0, spelling: shifted5},
      ],
    };
  },
  getMin5: function(noteNumber) {
    var topLetter = 'E5'
    var bottomLetter = 'A3';
    var diff = noteNumber - MIDI.keyToNote[topLetter];
    var noteNumbers = [];
    noteNumbers.push(this.getNoteNumber(topLetter, diff));
    noteNumbers.push(this.getNoteNumber('C5', diff));
    noteNumbers.push(this.getNoteNumber('A4', diff));
    noteNumbers.push(this.getNoteNumber(bottomLetter, diff));

    var shiftedBottom = this.getFlatSpelling(this.getNoteNumber(bottomLetter, diff));
    var shifted3 = this.getCorrectSpelling(this.getNoteNumber('C5', diff), shiftedBottom, 3);
    var shiftedTop = this.getCorrectSpelling(this.getNoteNumber(topLetter, diff), shiftedBottom, 5);
    var message = shiftedTop + '\n';
    message += shiftedBottom  + 'min5';
    
    return {
      noteNumbers: noteNumbers,
      message: message,
      configuration: [
        {x: 0, y: 0, spelling: shiftedTop},
        {x: -1, y: 0, spelling: shifted3},
        {x: -2, y: -1, isRoot: true, spelling: shiftedBottom},
      ],
    };
  },

  // ~ -Sus7
  getMin7: function(noteNumber) {
    var topLetter = 'G5';
    var bottomLetter = 'A3';
    var diff = noteNumber - MIDI.keyToNote[topLetter];
    var noteNumbers = [];
    noteNumbers.push(this.getNoteNumber(topLetter, diff));
    noteNumbers.push(this.getNoteNumber('E5', diff));
    noteNumbers.push(this.getNoteNumber('C5', diff));
    noteNumbers.push(this.getNoteNumber(bottomLetter, diff));
    
    var shiftedBottom = this.getFlatSpelling(this.getNoteNumber(bottomLetter, diff));
    var shifted3 = this.getCorrectSpelling(this.getNoteNumber('C5', diff), shiftedBottom, 3);
    var shifted5 = this.getCorrectSpelling(this.getNoteNumber('E5', diff), shiftedBottom, 5);
    var shiftedTop = this.getCorrectSpelling(this.getNoteNumber(topLetter, diff), shiftedBottom, 7);
    var message = shiftedTop + '\n';
    message += shiftedBottom  + 'min7'; 

    return {
      noteNumbers: noteNumbers,
      message: message,
      configuration: [
        {x: 0, y: 0, spelling: shiftedTop},
        {x: -1, y: -1, spelling: shifted5},
        {x: -2, y: -1, spelling: shifted3},
        {x: -3, y: -2, isRoot: true, spelling: shiftedBottom},
      ],
    };
  },
  // closed; ~ -Sus2
  getMin9: function(noteNumber) {
    var topLetter = 'B5'
    var bottomLetter = 'A3';
    var diff = noteNumber - MIDI.keyToNote[topLetter];
    var noteNumbers = [];
    noteNumbers.push(this.getNoteNumber(topLetter, diff));
    noteNumbers.push(this.getNoteNumber('E5', diff));
    noteNumbers.push(this.getNoteNumber('C5', diff));
    noteNumbers.push(this.getNoteNumber('G4', diff));
    noteNumbers.push(this.getNoteNumber(bottomLetter, diff));

    var shiftedBottom = this.getFlatSpelling(this.getNoteNumber(bottomLetter, diff));
    var shifted3 = this.getCorrectSpelling(this.getNoteNumber('C5', diff), shiftedBottom, 3);
    var shifted5 = this.getCorrectSpelling(this.getNoteNumber('E5', diff), shiftedBottom, 5);
    var shifted7 = this.getCorrectSpelling(this.getNoteNumber('G4', diff), shiftedBottom, 7);
    var shiftedTop = this.getCorrectSpelling(this.getNoteNumber(topLetter, diff), shiftedBottom, 9);
    var message = shiftedTop + '\n';
    message += shiftedBottom  + 'min9'; 
    
    return {
      noteNumbers: noteNumbers,
      message: message,
      configuration: [
        {x: 0, y: 0, spelling: shiftedTop},
        {x: -1, y: -2, isRoot: true, spelling: shiftedBottom},
        {x: -2, y: -1, spelling: shifted5},
        {x: -3, y: -1, spelling: shifted3},
      ],
    };
  },
  // ~ -Sus4
  getMin11: function(noteNumber) {
    var topLetter = 'D5'
    var bottomLetter = 'A3';
    var diff = noteNumber - MIDI.keyToNote[topLetter];
    var noteNumbers = [];
    noteNumbers.push(this.getNoteNumber(topLetter, diff));
    noteNumbers.push(this.getNoteNumber('E4', diff));
    noteNumbers.push(this.getNoteNumber('C4', diff));
    noteNumbers.push(this.getNoteNumber(bottomLetter, diff));

    var shiftedBottom = this.getFlatSpelling(this.getNoteNumber(bottomLetter, diff));
    var shifted3 = this.getCorrectSpelling(this.getNoteNumber('C4', diff), shiftedBottom, 3);
    var shifted5 = this.getCorrectSpelling(this.getNoteNumber('E4', diff), shiftedBottom, 5);
    var shiftedTop = this.getCorrectSpelling(this.getNoteNumber(topLetter, diff), shiftedBottom, 4);
    var message = shiftedTop + '\n';
    message += shiftedBottom  + 'min11';
    
    return {
      noteNumbers: noteNumbers,
      message: message,
      configuration: [
        {x: 0, y: 0, spelling: shiftedTop},
        {x: -1, y: -2, spelling: shifted3},
        {x: -2, y: -3, isRoot: true, spelling: shiftedBottom},
        {x: -3, y: -2, spelling: shifted5},
      ],
    };
  },
  getMin6: function(noteNumber) {
    var topLetter = 'B4'
    var bottomLetter = 'D3';
    var diff = noteNumber - MIDI.keyToNote[topLetter];
    var noteNumbers = [];
    noteNumbers.push(this.getNoteNumber(topLetter, diff));
    noteNumbers.push(this.getNoteNumber('A4', diff));
    noteNumbers.push(this.getNoteNumber('F4', diff));
    noteNumbers.push(this.getNoteNumber(bottomLetter, diff));

    var shiftedBottom = this.getFlatSpelling(this.getNoteNumber(bottomLetter, diff));
    var shifted3 = this.getCorrectSpelling(this.getNoteNumber('F4', diff), shiftedBottom, 3);
    var shifted5 = this.getCorrectSpelling(this.getNoteNumber('A4', diff), shiftedBottom, 5);
    var shiftedTop = this.getCorrectSpelling(this.getNoteNumber(topLetter, diff), shiftedBottom, 6);
    var message = shiftedTop + '\n';
    message += shiftedBottom  + 'min6';
    
    return {
      noteNumbers: noteNumbers,
      message: message,
      configuration: [
        {x: 0, y: 0, spelling: shiftedTop},
        {x: -1, y: -2, spelling: shifted5},
        {x: -2, y: -2, spelling: shifted3},
        {x: -3, y: -3, isRoot: true, spelling: shiftedBottom},
      ],
    };
  },
  // dim7, or min6
  getDim7: function(noteNumber) {
    var topLetter = 'B5'
    var bottomLetter = 'D4';
    var diff = noteNumber - MIDI.keyToNote[topLetter];
    var noteNumbers = [];
    noteNumbers.push(this.getNoteNumber(topLetter, diff));
    noteNumbers.push(this.getNoteNumber('Ab5', diff));
    noteNumbers.push(this.getNoteNumber('F5', diff));
    noteNumbers.push(this.getNoteNumber(bottomLetter, diff));

    var shiftedBottom = this.getFlatSpelling(this.getNoteNumber(bottomLetter, diff));
    var shifted3 = this.getCorrectSpelling(this.getNoteNumber('F5', diff), shiftedBottom, 3);
    var shifted5 = this.getCorrectSpelling(this.getNoteNumber('Ab5', diff), shiftedBottom, 5);
    var shiftedTop = this.getCorrectSpelling(this.getNoteNumber(topLetter, diff), shiftedBottom, 7);
    var message = shiftedTop + '\n';
    message += shiftedBottom  + 'dim7';
    
    return {
      noteNumbers: noteNumbers,
      message: message,
      noteNumbers: noteNumbers,
      message: message,
      configuration: [
        {x: 0, y: 0, spelling: shiftedTop},
        {x: -1, y: -1, spelling: shifted5},
        {x: -2, y: -2, spelling: shifted3},
        {x: -3, y: -3, isRoot: true, spelling: shiftedBottom},
      ],
    };
  },

  getDom1: function(noteNumber) {
    var topLetter = 'G5';
    var bottomLetter = 'G3';
    var diff = noteNumber - MIDI.keyToNote[topLetter];
    var noteNumbers = [];
    noteNumbers.push(this.getNoteNumber(topLetter, diff));
    noteNumbers.push(this.getNoteNumber('D5', diff));
    noteNumbers.push(this.getNoteNumber('B4', diff));
    noteNumbers.push(this.getNoteNumber('F4', diff));
    noteNumbers.push(this.getNoteNumber(bottomLetter, diff));

    var shiftedBottom = this.getFlatSpelling(this.getNoteNumber(bottomLetter, diff));
    var shifted3 = this.getCorrectSpelling(this.getNoteNumber('B4', diff), shiftedBottom, 3);
    var shifted5 = this.getCorrectSpelling(this.getNoteNumber('D5', diff), shiftedBottom, 5);
    var shifted7 = this.getCorrectSpelling(this.getNoteNumber('F4', diff), shiftedBottom, 7);
    var shiftedTop = shiftedBottom;
    var message = shiftedTop + '\n';
    message += shiftedBottom  + 'dom1';
    
    return {
      noteNumbers: noteNumbers,
      message: message,
      configuration: [
        {x: 0, y: 0, isRoot: true, spelling: shiftedBottom},
        {x: -1, y: 1, spelling: shifted5},
        {x: -2, y: 0, spelling: shifted3},
        {x: -3, y: 2, spelling: shifted7},
      ],
    };
  },
  getDom3: function(noteNumber) {
    var topLetter = 'B5';
    var bottomLetter = 'G3';
    var diff = noteNumber - MIDI.keyToNote[topLetter];
    var noteNumbers = [];
    noteNumbers.push(this.getNoteNumber(topLetter, diff));
    noteNumbers.push(this.getNoteNumber('F4', diff));
    noteNumbers.push(this.getNoteNumber('D4', diff));
    noteNumbers.push(this.getNoteNumber(bottomLetter, diff));

    var shiftedBottom = this.getFlatSpelling(this.getNoteNumber(bottomLetter, diff));
    var shifted5 = this.getCorrectSpelling(this.getNoteNumber('D4', diff), shiftedBottom, 5);
    var shifted7 = this.getCorrectSpelling(this.getNoteNumber('F4', diff), shiftedBottom, 7);
    var shiftedTop = this.getCorrectSpelling(this.getNoteNumber(topLetter, diff), shiftedBottom, 3);
    var message = shiftedTop + '\n';
    message += shiftedBottom  + 'dom3';
    
    return {
      noteNumbers: noteNumbers,
      message: message,
      configuration: [
        {x: 0, y: 0, spelling: shiftedTop},
        {x: -1, y: 0, isRoot: true, spelling: shiftedBottom},
        {x: -2, y: -2, spelling: shifted7},
      ],
    };
  },
  getDom5: function(noteNumber) {
    var topLetter = 'D5';
    var bottomLetter = 'G3';
    var diff = noteNumber - MIDI.keyToNote[topLetter];
    var noteNumbers = [];
    noteNumbers.push(this.getNoteNumber(topLetter, diff));
    noteNumbers.push(this.getNoteNumber('B4', diff));
    noteNumbers.push(this.getNoteNumber('F4', diff));
    noteNumbers.push(this.getNoteNumber(bottomLetter, diff));

    var shiftedBottom = this.getFlatSpelling(this.getNoteNumber(bottomLetter, diff));
    var shifted3 = this.getCorrectSpelling(this.getNoteNumber('B4', diff), shiftedBottom, 3);
    var shifted7 = this.getCorrectSpelling(this.getNoteNumber('F4', diff), shiftedBottom, 7);
    var shiftedTop = this.getCorrectSpelling(this.getNoteNumber(topLetter, diff), shiftedBottom, 5);
    var message = shiftedTop + '\n';
    message += shiftedBottom  + 'dom5';
    
    return {
      noteNumbers: noteNumbers,
      message: message,
      configuration: [
        {x: 0, y: 0, spelling: shiftedTop},
        {x: -1, y: -1, spelling: shifted3},
        {x: -2, y: -1, isRoot: true, spelling: shiftedBottom},
        {x: -3, y: -3, spelling: shifted7},
      ],
    };
  },
  getDom7: function(noteNumber) {
    var topLetter = 'F5';
    var bottomLetter = 'G3';
    var diff = noteNumber - MIDI.keyToNote[topLetter];
    var noteNumbers = [];
    noteNumbers.push(this.getNoteNumber(topLetter, diff));
    noteNumbers.push(this.getNoteNumber('B4', diff));
    noteNumbers.push(this.getNoteNumber('D4', diff));
    noteNumbers.push(this.getNoteNumber(bottomLetter, diff));

    var shiftedBottom = this.getFlatSpelling(this.getNoteNumber(bottomLetter, diff));
    var shifted3 = this.getCorrectSpelling(this.getNoteNumber('B4', diff), shiftedBottom, 3);
    var shifted5 = this.getCorrectSpelling(this.getNoteNumber('D4', diff), shiftedBottom, 5);
    var shiftedTop = this.getCorrectSpelling(this.getNoteNumber(topLetter, diff), shiftedBottom, 7);
    var message = shiftedTop + '\n';
    message += shiftedBottom  + 'dom7';
    
    return {
      noteNumbers: noteNumbers,
      message: message,
      configuration: [
        {x: 0, y: 0, spelling: shiftedTop},
        {x: -1, y: -1, spelling: shifted5},
        {x: -2, y: -2, spelling: shifted3},
        {x: -3, y: -2, isRoot: true, spelling: shiftedBottom},
      ],
    };
  },
  getDom11: function(noteNumber) {
    var topLetter = 'C6';
    var bottomLetter = 'G4';
    var diff = noteNumber - MIDI.keyToNote[topLetter];
    var noteNumbers = [];
    noteNumbers.push(this.getNoteNumber(topLetter, diff));
    noteNumbers.push(this.getNoteNumber('F5', diff));
    noteNumbers.push(this.getNoteNumber('D5', diff));
    noteNumbers.push(this.getNoteNumber('B4', diff));
    noteNumbers.push(this.getNoteNumber(bottomLetter, diff));

    var shiftedBottom = this.getFlatSpelling(this.getNoteNumber(bottomLetter, diff));
    var shifted5 = this.getCorrectSpelling(this.getNoteNumber('D5', diff), shiftedBottom, 5);
    var shifted7 = this.getCorrectSpelling(this.getNoteNumber('F5', diff), shiftedBottom, 7);
    var shiftedTop = this.getCorrectSpelling(this.getNoteNumber(topLetter, diff), shiftedBottom, 4);
    var message = shiftedTop + '\n';
    message += shiftedBottom  + 'dom11';
    
    return {
      noteNumbers: noteNumbers,
      message: message,
      configuration: [
        {x: 0, y: 0, spelling: shiftedTop},
        {x: -1, y: 1, isRoot: true, spelling: shiftedBottom},
        {x: -2, y: -1, spelling: shifted7},
        {x: -3, y: -2, spelling: shifted5},
      ],
    };
  },
  getDom9: function(noteNumber) {
    var topLetter = 'A5';
    var bottomLetter = 'G3';
    var diff = noteNumber - MIDI.keyToNote[topLetter];
    var noteNumbers = [];
    noteNumbers.push(this.getNoteNumber(topLetter, diff));
    noteNumbers.push(this.getNoteNumber('D5', diff));
    noteNumbers.push(this.getNoteNumber('B4', diff));
    noteNumbers.push(this.getNoteNumber('F4', diff));
    noteNumbers.push(this.getNoteNumber(bottomLetter, diff));

    var shiftedBottom = this.getFlatSpelling(this.getNoteNumber(bottomLetter, diff));
    var shifted3 = this.getCorrectSpelling(this.getNoteNumber('B4', diff), shiftedBottom, 3);
    var shifted7 = this.getCorrectSpelling(this.getNoteNumber('F4', diff), shiftedBottom, 7);
    var shiftedTop = this.getCorrectSpelling(this.getNoteNumber(topLetter, diff), shiftedBottom, 2);
    var message = shiftedTop + '\n';
    message += shiftedBottom  + 'dom9';
    
    return {
      noteNumbers: noteNumbers,
      message: message,
      configuration: [
        {x: 0, y: 0, spelling: shiftedTop},
        {x: -1, y: 0, spelling: shifted7},
        {x: -2, y: 2, spelling: shifted3},
        {x: -3, y: 2, isRoot: true, spelling: shiftedTop},
      ],
    };
  },
  getDom13: function(noteNumber) {
    var topLetter = 'E5';
    var bottomLetter = 'G3';
    var diff = noteNumber - MIDI.keyToNote[topLetter];
    var noteNumbers = [];
    noteNumbers.push(this.getNoteNumber(topLetter, diff));
    noteNumbers.push(this.getNoteNumber('B4', diff));
    noteNumbers.push(this.getNoteNumber('F4', diff));
    noteNumbers.push(this.getNoteNumber('D4', diff));
    noteNumbers.push(this.getNoteNumber(bottomLetter, diff));

    var shiftedBottom = this.getFlatSpelling(this.getNoteNumber(bottomLetter, diff));
    var shifted3 = this.getCorrectSpelling(this.getNoteNumber('B4', diff), shiftedBottom, 3);
    var shifted7 = this.getCorrectSpelling(this.getNoteNumber('F4', diff), shiftedBottom, 7);
    var shiftedTop = this.getCorrectSpelling(this.getNoteNumber(topLetter, diff), shiftedBottom, 6);
    var message = shiftedTop + '\n';
    message += shiftedBottom  + 'dom13';
    
    return {
      noteNumbers: noteNumbers,
      message: message,
      configuration: [
        {x: 0, y: 0, spelling: shiftedTop},
        {x: -1, y: 1, spelling: shifted3},
        {x: -2, y: 1, isRoot: true, spelling: shiftedBottom},
        {x: -3, y: -1, spelling: shifted7},
      ],
    };
  },

  getAug5: function(noteNumber) {
    var topLetter = 'Ab4';
    var bottomLetter = 'C3';
    var diff = noteNumber - MIDI.keyToNote[topLetter];
    var noteNumbers = [];
    noteNumbers.push(this.getNoteNumber(topLetter, diff));
    noteNumbers.push(this.getNoteNumber('E4', diff));
    noteNumbers.push(this.getNoteNumber(bottomLetter, diff));

    var shiftedBottom = this.getFlatSpelling(this.getNoteNumber(bottomLetter, diff));
    var shifted3 = this.getCorrectSpelling(this.getNoteNumber('E4', diff), shiftedBottom, 3);
    var shiftedTop = this.getCorrectSpelling(this.getNoteNumber(topLetter, diff), shiftedBottom, 5);
    var message = shiftedTop + '\n';
    message += shiftedBottom  + 'aug5';
    
    return {
      noteNumbers: noteNumbers,
      message: message,
      configuration: [
        {x: 0, y: 0, spelling: shiftedTop},
        {x: -1, y: 0, spelling: shifted3},
        {x: -2, y: 0, isRoot: true, spelling: shiftedBottom},
      ],
    };
  },
  getLetter: function(startLetter, interval) {
    startLetter = startLetter.slice(0,1);
    var conversion = {
      "A": 0,
      "B": 1,
      "C": 2,
      "D": 3,
      "E": 4,
      "F": 5,
      "G": 6,
    };
    var reverseConversion = {
      0: "A",
      1: "B",
      2: "C",
      3: "D",
      4: "E",
      5: "F",
      6: "G",
    };
    var num = conversion[startLetter] + interval - 1;
    num = num % 7;
    return reverseConversion[num];
  },
  getCorrectSpelling: function(noteNumber, bottomLetter, interval){
    var correctLetter = this.getLetter(bottomLetter, interval);
    for (var n = 0; n < 15; n++) {
      if (Math.abs(MIDI.keyToNote[correctLetter + n] - noteNumber) <= 6) {
        var diff = MIDI.keyToNote[correctLetter + n] - noteNumber;
        break;
      }
    }
    while (diff !== 0) {
      if (diff > 0) {
        correctLetter += '\u266D';
        diff--;
      } else {
        correctLetter += '\u266F';
        diff++;
      }
    }
    return correctLetter;
  },
}
