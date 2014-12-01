if (typeof(MIDI) === "undefined") MIDI = {};

MIDI.JoinPlugin = {
  init: function(info){
    if (!info) info = {};
    this.info = info;
    // this.count = 0;
    this.positionToNotes = info.positionToNotes;
    this.smallestNoteNumber = info.startNoteNumber || 50;
    MIDI.GuitarGui.init(this.smallestNoteNumber, onStart, onMove, onEnd, onDragOver, menuOptions);
    MIDI.Editor.init();
  },
}

var menuOptions = [
  {
    name: 'Space',
    action: function(){
      MIDI.Editor.insert({
        type: 'space',
      });
    },
  }, {
    name: 'Rest',
    action: function(){
      MIDI.Editor.insert({
        type: 'rest',
      });
    },
  }, {
    name: 'Undo',
    action: function(){
      MIDI.Editor.undo();
    },
  }, {
    name: 'Redo',
    action: function(){
      MIDI.Editor.redo();
    },
  }, {
    name: 'Lower',
    action: function(){
      MIDI.GuitarGui.setStartNoteNumber(MIDI.GuitarGui.getStartNoteNumber() - MIDI.GuitarGui.getJump());
    },
  }, {
    name: 'Higher',
    action: function(){
      MIDI.GuitarGui.setStartNoteNumber(MIDI.GuitarGui.getStartNoteNumber() + MIDI.GuitarGui.getJump());
    },
  }, {
    name: 'Zoom In',
    action: function(){
      MIDI.Editor.zoomIn();
    },
  }, {
    name: 'Zoom Out',
    action: function(){
      MIDI.Editor.zoomOut();
    },
  },
]

var noteNumber, startX, startY, startRow, startCol, dragOver, highlighted, isShort, endX, endY, conversion, startKey, noteNumbers, chord;
var onStart = function(x, y){
  dragOver = null;
  conversion = null;
  startKey = this;

  startRow = this.data('row');
  startCol = this.data('column');
  noteNumber = MIDI.GuitarGui.positionToNoteNumber(startRow, startCol);
  var id = '0,0';
  chord = MIDI.JoinPlugin.positionToNotes[id](noteNumber);

  if (highlighted) {
    highlighted.forEach(function(info){
      MIDI.GuitarGui.undisplay(info);
    });
  }
  highlighted = getKeys(chord.configuration, MIDI.GuitarGui.numRows, MIDI.GuitarGui.numCols);
  highlighted.forEach(function(info){
    MIDI.GuitarGui.display(info);
  });
  
  // MIDI.GuitarGui.addText(chord.message);
  noteNumbers = chord.noteNumbers;
}

var onMove = function(dx, dy, x, y, event){}

var onEnd = function(info){
  noteNumbers.forEach(function(noteNumber){
    MIDI.ChordPlayer.play(noteNumber);
  });
  MIDI.Editor.insert(chord);
}

var onDragOver = function(elt){
  if (dragOver === elt) {
    return;
  } else {
    dragOver = elt;
    var rowDiff = -(elt.data('row') - startRow);
    var colDiff = elt.data('column') - startCol;
    var id = colDiff + ',' + rowDiff;
    var getChord = MIDI.JoinPlugin.positionToNotes[id];
    if (getChord) {
      if (highlighted) {
        highlighted.forEach(function(info){
          MIDI.GuitarGui.undisplay(info);
        });
      }

      chord = getChord(noteNumber);
      // MIDI.GuitarGui.replaceText(chord.message);
      noteNumbers = chord.noteNumbers;
      highlighted = getKeys(chord.configuration, MIDI.GuitarGui.numRows, MIDI.GuitarGui.numCols);
      highlighted.forEach(function(info){
        MIDI.GuitarGui.display(info);
      });
    }
  }
}

// global: startKey, noteNumber, noteNumbers, startRow, startCol
// select the keys that are actually playable on the guitar
var getKeys = function(configuration, numRows, numCols){
  var myStartRow = startRow;
  var myStartCol = startCol;

  // todo: debug this
  var left = 0;
  configuration.forEach(function(info) {
    if (left < -info.x) {
      left = -info.x;
    }
  });
  var top = 0;
  configuration.forEach(function(info) {
    if (top < info.y) {
      top = info.y;
    }
  });

  var bottom = 0;
  configuration.forEach(function(info) {
    if (bottom > info.y) {
      bottom = info.y;
    }
  });

  while (myStartRow - top < 0) {
    myStartRow += 4;
    myStartCol -= 1;
  }

  while (myStartRow - bottom > numRows - 2) {
    myStartRow -= 4;
    myStartCol += 1;
  }

  while (myStartCol - left < 0) {
      myStartCol += 3;
  }
  while (myStartCol > numCols) {
    myStartCol -= 3;
  } 
  var ret = [];
  configuration.forEach(function(info){
    var row = myStartRow - info.y;
    var col = myStartCol + info.x;
    ret.push({
      row: row,
      col: col,
      spelling: info.spelling,
      isRoot: info.isRoot,
    });
  });

  return ret;
}

// todo: write a function that return a list of {row: row, col: col} given a noteNumber
// compute the L1 distance for each such object to the existing highlighted region
// retrieve the key using GuitarGui.getKey(row, col) and display it.

