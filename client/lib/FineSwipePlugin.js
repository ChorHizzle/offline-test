if (typeof(MIDI) === "undefined") MIDI = {};

MIDI.FineSwipePlugin = {
  init: function(info){
    if (!info) info = {};
    this.info = info;
    // this.count = 0;
    this.swipeActions = info.swipeActions;
    this.longSwipeActions = info.longSwipeActions || info.swipeActions;
    this.swipeToNoteNumbers = info.swipeToNoteNumbers;
    this.longSwipeToNoteNumbers = info.longSwipeToNoteNumbers;
    this.smallestNoteNumber = info.startNoteNumber || 50;
    MIDI.GuitarGui.init(this.smallestNoteNumber, onStart, onMove, onEnd, onDragOver);
  },
}

var noteNumber, startX, startY, startRow, startCol, dragOver, highlighted, isShort, endX, endY, conversion, startKey, noteNumbers;
var onStart = function(x, y){
  dragOver = null;
  conversion = null
  startX = x;
  startY = y;
  startKey = this;

  startRow = this.data('row');
  startCol = this.data('column');
  noteNumber = this.data('noteNumber');
}
var onMove = function(dx, dy, x, y, event){
  // if (dragOver === null) return;
  if (startKey.isPointInside(x,y)) return;
  var deltaX = x - startX;
  var deltaY = - (y - startY);
  if (deltaX !== 0) {
    var slope = deltaY / deltaX;
  }
  var newConversion = getConversion(deltaX, deltaY, slope);
  if (newConversion !== conversion) {
    conversion = newConversion;
    if (highlighted) {
      highlighted.forEach(function(key){
        MIDI.GuitarGui.undisplay(key);
      });
    }
    var notes = conversion(noteNumber);
    noteNumbers = notes.noteNumbers;
    highlighted = getKeys(MIDI.FineSwipePlugin.smallestNoteNumber, MIDI.GuitarGui.numRows, MIDI.GuitarGui.numCols);
    highlighted.forEach(function(key){
      MIDI.GuitarGui.display(key);
    });
  }
}
var onEnd = function(info){
  if (dragOver === null) {
    MIDI.ChordPlayer.play(noteNumber);
  } else {
    noteNumbers.forEach(function(noteNumber){
      MIDI.ChordPlayer.play(noteNumber);
    });
  }
}
var onDragOver = function(elt){
  if (elt === startKey || elt.type === 'text') {
    return;
  } else if (dragOver === elt) {
    return;
  } else {
    dragOver = elt;
    var endRow = elt.data('row');
    var endCol = elt.data('column');
    isShort = Math.max(Math.abs(endRow - startRow), Math.abs(endCol - startCol)) === 1;
  }
}

// isShort and noteNumber are global
var getConversion = function(dx, dy, slope) {
  var conversions;
  if (isShort) {
    conversions = MIDI.FineSwipePlugin.swipeToNoteNumbers;
  } else {
    conversions = MIDI.FineSwipePlugin.longSwipeToNoteNumbers;
  }
  if (dx > 0 && slope < -1/2 && slope > -2) { // -45
    return conversions[315];
  } else if (dx > 0 && slope > -1/2 && slope < 1/2) { // 0
    return conversions[0];
  } else if (dx > 0 && slope > 1/2 && slope < 2) { // 45
    return conversions[45];
  } else if (dx < 0 && slope > -2 && slope < -1/2) { // 135
    return conversions[135];
  } else if (dx < 0 && slope > -1/2 && slope < 1/2) { // 180
    return conversions[180];
  } else if (dx < 0 && slope > 1/2 && slope < 2) { // -135
    return conversions[225];
  } else if (dy > 0) { // 90
    return conversions[90];
  } else { // -90
    return conversions[270];
  }
}

// global: startKey, noteNumber, noteNumbers, startRow, startCol
var getKeys = function(smallestNoteNumber, numRows, numCols){
  var ret = [];
  noteNumbers.forEach(function(newNoteNumber){
    var diff = newNoteNumber - noteNumber;
    var col = startCol;
    if (diff > 1) {
      while (diff > 1) {
        col++;
        diff -= 4;
      } 
    } else if (diff < -1) {
      while (diff < -1) {
        col--;
        diff += 4;
      }
    }
    var row = startRow + diff;
    while (row < 0) {
      row += 4;
      col--;  
    }
    while (row >= numRows) {
      row -= 4;
      col++;  
    }
    while (col < 0) {
      col += 3;
    }
    while (col >= numCols) {
      col -= 3;
    }
    ret.push(MIDI.GuitarGui.getKey(row, col))
  });

  return ret;
}

// todo: write a function that return a list of {row: row, col: col} given a noteNumber
// compute the L1 distance for each such object to the existing highlighted region
// retrieve the key using GuitarGui.getKey(row, col) and display it.

