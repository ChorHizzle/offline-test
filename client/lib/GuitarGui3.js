if (typeof(MIDI) === "undefined") MIDI = {};

MIDI.GuitarGui3 = {
  keyWidth: 45,
  keyHeight: 45,
  init: function(start){
    this.start = start || 40;
    this.computeDimensions();
    this.paper = new Raphael(0, 0, $(window).width(), $(window).height());
    this.draw();
  },
  destroy: function(){
    this.paper.remove();
  },

  computeDimensions: function(){
    this.numCols = Math.floor($(window).width() / this.keyWidth);
    this.numRows = Math.floor($(window).height() / this.keyHeight);
  },

  draw: function(){
    this.drawKeys();
  },

  drawKeys: function(){
    var self = this;

    for (var i = 0; i < this.numRows; i++){
      for (var k = 0; k < this.numCols; k++){
        var x = k * this.keyWidth;
        var y = i * this.keyHeight;

        if (k % 2) { var fill = '#e60';
        } else { var fill = '#e90'; }

        var key = this.paper
          .rect(x, y, this.keyWidth, this.keyHeight)
          .attr({fill: fill})
          .data('fill', fill)
          .data('row', i).data('column', k)
          .drag(onmove, onstart, onend)
          .onDragOver(recordToDragOvers);

        var ACCELERATION_THRESHOLD = -1.5;
        var THRESHOLD = 150;
        var isFirst, dragOverDict, currentDragOver;

        var onstart = function(x, y){
          var row = this.data('row');
          var col = this.data('column');
          var id = row + ',' + col;
          currentDragOver = {
            noteNumber: rowColumnToNoteNumber(row, col, self.start),
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

        var recordToDragOvers = function(elt){
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
              noteNumber: rowColumnToNoteNumber(row, col, self.start),
              row: row,
              col: col,
              elt: elt,
              startTime: Date.now(),
            };
            isFirst = false;
          }
        };

        var onmove = function(dx, dy, x, y, event){};

        var onend = function(info){
          dragOverDict[currentDragOver.col] = currentDragOver;
          currentDragOver.elt.attr({fill: '#fb0'});

          for (var col in dragOverDict) {
            var key = dragOverDict[col];
            MIDI.ChordPlayer.play(key.noteNumber);
            key.elt.attr({fill: key.elt.data('fill')});
          }
        }
      }
    }
  },
}

var rowColumnToNoteNumber = function(row, column, start) {
  var JUMP = 4;
  return start - column * JUMP + row;
}