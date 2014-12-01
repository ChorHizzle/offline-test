MIDI.GuitarGui.SwipePlugin = {
  init: function(info){
    if (!info) info = {};
    this.info = info;
    this.count = 0;
    this.swipeActions = info.swipeActions;
    MIDI.GuitarGui.init(info.startNoteNumber || 50, onStart, onMove, onEnd, onDragOver);
  },
}

var noteNumber, startX, startY;
var onStart = function(x, y){
  startX = x;
  startY = y;

  noteNumber = MIDI.GuitarGui.positionToNoteNumber(this.data('row'), this.data('column'), self.start);
  this.attr({fill: '#fb0'});
}
var onMove = function(dx, dy, x, y, event){}
var onEnd = function(info){
  this.attr({fill: this.data('fill')});

  var dx = info.pageX - startX;
  var dy = - info.pageY + startY;
  if (dx * dx + dy * dy < 20 * 20) {
    MIDI.GuitarGui.SwipePlugin.swipeActions['static'](noteNumber); 
  } else {
    if (dx !== 0) {
      var slope = dy / dx;
    }

    if (dx > 0 && slope < -1/2 && slope > -2) { // -45
      MIDI.GuitarGui.SwipePlugin.swipeActions[315](noteNumber);
    } else if (dx > 0 && slope > -1/2 && slope < 1/2) { // 0
      MIDI.GuitarGui.SwipePlugin.swipeActions[0](noteNumber);
    } else if (dx > 0 && slope > 1/2 && slope < 2) { // 45
      MIDI.GuitarGui.SwipePlugin.swipeActions[45](noteNumber);
    } else if (dx < 0 && slope > -2 && slope < -1/2) { // 135
      MIDI.GuitarGui.SwipePlugin.swipeActions[135](noteNumber);
    } else if (dx < 0 && slope > -1/2 && slope < 1/2) { // 180
      MIDI.GuitarGui.SwipePlugin.swipeActions[180](noteNumber);
    } else if (dx < 0 && slope > 1/2 && slope < 2) { // -135
      MIDI.GuitarGui.SwipePlugin.swipeActions[225](noteNumber);
    } else if (dy > 0) { // 90
      MIDI.GuitarGui.SwipePlugin.swipeActions[90](noteNumber);
    } else { // -90
      MIDI.GuitarGui.SwipePlugin.swipeActions[270](noteNumber);
    }
  }
  MIDI.GuitarGui.SwipePlugin.count++;
  
  if (MIDI.GuitarGui.SwipePlugin.count > 10) {
    MIDI.GuitarGui.destroy();
    MIDI.GuitarGui.SwipePlugin.init(MIDI.GuitarGui.SwipePlugin.info);
  }
}
var onDragOver = function(elt){}
