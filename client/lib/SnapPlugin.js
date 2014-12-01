
MIDI.GuitarGui.SnapPlugin = {
  init: function(info){
    if (!info) info = {};
    this.info = info;
    this.count = 0;
    MIDI.GuitarGui.init(info.startNoteNumber || 50, onStart, onMove, onEnd, onDragOver);
  },
}

var THRESHOLD = 150;
var isFirst, dragOverDict, currentDragOver;

var onStart = function(x, y){
  var row = this.data('row');
  var col = this.data('column');
  var id = row + ',' + col;
  currentDragOver = {
    noteNumber: MIDI.GuitarGui.positionToNoteNumber(row, col),
    row: row, 
    col: col, 
    elt: this, 
    startTime: Date.now()
  };
  isFirst = true;
  dragOverDict = {};
  dragOverDict[col] = currentDragOver;
  this.attr({fill: '#fb0'});
}

var onDragOver = function(elt){
  elt.attr({fill: '#fb0'});
  var row = elt.data('row');
  var col = elt.data('column');
  var id = row + ',' + col;
  currentDragOver.endTime = Date.now();
  if (currentDragOver.row !== row || currentDragOver.col !== col){
    if (currentDragOver.endTime - currentDragOver.startTime > THRESHOLD) {
      var existing = dragOverDict[currentDragOver.col];
      if (existing) {
        existing.elt.attr({fill: existing.elt.data('fill')});
      }
      dragOverDict[currentDragOver.col] = currentDragOver;
      currentDragOver.elt.attr({fill: '#fb0'});
    } else if (!isFirst) {
      currentDragOver.elt.attr({fill: currentDragOver.elt.data('fill')});
    }

    currentDragOver = {
      noteNumber: MIDI.GuitarGui.positionToNoteNumber(row, col),
      row: row,
      col: col,
      elt: elt,
      startTime: Date.now(),
    };
    isFirst = false;
  }
};

var onMove = function(dx, dy, x, y, event){};

var onEnd = function(info){
  dragOverDict[currentDragOver.col] = currentDragOver;
  currentDragOver.elt.attr({fill: '#fb0'});

  for (var col in dragOverDict) {
    var key = dragOverDict[col];
    MIDI.ChordPlayer.play(key.noteNumber);
    key.elt.attr({fill: key.elt.data('fill')});
  }

  MIDI.GuitarGui.SnapPlugin.count++;
  if (MIDI.GuitarGui.SnapPlugin.count > 40) {
    MIDI.GuitarGui.destroy();
    MIDI.GuitarGui.SnapPlugin.init(MIDI.GuitarGui.SnapPlugin.info);
  }
}