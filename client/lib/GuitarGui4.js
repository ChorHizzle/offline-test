// if (typeof(MIDI) === "undefined") MIDI = {};

// MIDI.GuitarGui4 = {
//   keyWidth: 45,
//   keyHeight: 45,
//   init: function(start){
//     this.start = start || 40;
//     this.computeDimensions();
      
//     // TODO: handle resize

//     this.paper = new Raphael(0, 0, $(window).width(), $(window).height());

//     this.draw();
//   },

//   computeDimensions: function(){
//     this.numCols = Math.floor($(window).width() / this.keyWidth);
//     this.numRows = Math.floor($(window).height() / this.keyHeight);
//   },

//   draw: function(){
//     this.drawKeys();
//   },

//   drawKeys: function(){
//     var self = this;

//     for (var i = 0; i < this.numRows; i++){
//       for (var k = 0; k < this.numCols; k++){
//         var x = k * this.keyWidth;
//         var y = i * this.keyHeight;

//         if (k % 2) { var fill = '#e60';
//         } else { var fill = '#e90'; }

//         var key = this.paper
//           .rect(x, y, this.keyWidth, this.keyHeight)
//           .attr({fill: fill})
//           .data('fill', fill)
//           .data('row', i).data('column', k)
//           .drag(onmove, onstart, onend)
//           .onDragOver(recordToDragOvers);

//         var ACCELERATION_THRESHOLD = -1.5;
//         var time = Date.now();
//         var dragOverDict, dragOvers, currentDragOver, velocity;

//         var onstart = function(x, y){
//           var row = this.data('row');
//           var col = this.data('column');
//           var id = row + ',' + col;
//           currentDragOver = {row: row, col: col, elt: this};
//           // dragOvers = [currentDragOver];
//           dragOverDict = {}
//           dragOverDict[col] = currentDragOver;
//           time = Date.now();
//           velocity = 0;
//           this.attr({fill: '#fb0'});
//         }

//         var recordToDragOvers = function(elt){
//           currentDragOver = {row: elt.data('row'), col: elt.data('column'), elt: elt};
//         };

//         var onmove = function(dx, dy, x, y, event){
//           var currentTime = Date.now();       
//           var currentVelocity = (dx * dx + dy * dy) / (currentTime - time);
//           var acc =(currentVelocity - velocity) / (currentTime - time);
//           if (acc < ACCELERATION_THRESHOLD) {
//             var row = currentDragOver.row;
//             var col = currentDragOver.col;
//             // var id = row + ',' + col;
//             var existing = dragOverDict[col];
//             if (!existing){
//               dragOverDict[col] = currentDragOver;
//               currentDragOver.elt.attr({fill: '#fb0'})
//             } else if (existing.row !== row) {
//               existing.elt.attr({fill: existing.elt.data('fill')});
//               dragOverDict[col] = currentDragOver;
//               currentDragOver.elt.attr({fill: '#fb0'})
//             }
//           } 

//           time = currentTime;
//           velocity = currentVelocity;
//         }

//         var onend = function(info){
//           // currentDragOver = null; // clear it just to be safe
//           // var noteNumbers = [];
//           for (var col in dragOverDict) {
//             var position = dragOverDict[col];
//             MIDI.ChordPlayer.play(rowColumnToNoteNumber(position.row, position.col, self.start))
//             position.elt.attr({fill: position.elt.data('fill')});
//           }
//           // dragOvers.forEach(function(position){
//           // })
//         }
//       }
//     }
//   },
// }

// var rowColumnToNoteNumber = function(row, column, start) {
//   var JUMP = 4;
//   return start + column * JUMP + row;
// }