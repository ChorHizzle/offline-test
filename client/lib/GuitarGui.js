if (typeof(MIDI) === "undefined") MIDI = {};

MIDI.GuitarGui = {  
  init: function(startNoteNumber, onStart, onMove, onEnd, onDragOver, menuOptions){
    this.menuOptions = menuOptions;
    this.setStartNoteNumber(startNoteNumber || 40);
    this.setJump(4);

    this.setOnStart(onStart);
    this.setOnMove(onMove);
    this.setOnEnd(onEnd);
    this.setOnDragOver(onDragOver);

    this.setKeyWidth(45);
    this.setKeyHeight(45);
    this.computeDimensions();
    this.resetKeys();
    // this.resetTexts();
    this.paper = new Raphael(0, 0, this.width, this.height);
    this.draw();
  },

  clearContents: function(){
    var self = this;
    this.textElements.forEach(function(elt, col){
      elt.attr({text: ""});
      var keyElt = self.getContentKey(col);
      keyElt.data('startBeat', null);
    });
  },

  displayContent: function(col, content){
    var elt = this.textElements[col];
    if (elt) {
      elt.attr({text: content.message});
      var keyElt = this.getContentKey(col);
      keyElt.data('startBeat', content.startBeat);
    }
  },

  display: function(info){
    var elt = this.keyTextElements[info.row + ',' + info.col]
    if (elt) {
      elt.attr({
        text: info.spelling ? info.spelling : "?",
        'font-size': info.isRoot ? 18 : 14,
      });
    }
  },
  undisplay: function(info){
    var elt = this.keyTextElements[info.row + ',' + info.col]
    if (elt){
      elt.attr({
        text: "",
      });
    }
  },

  setJump: function(arg){
    this.jump = arg;
  },
  getJump: function(){
    return this.jump;
  },
  setOnEnd: function(func){
    this.onEnd = func;
  },
  setOnMove: function(func){
    this.onMove = func;
  },
  setOnStart: function(func){
    var self = this;
    this.onStart = func;
  },
  setOnDragOver: function(func){
    this.onDragOver = func;
  },
  setKeyWidth: function(arg){ this.keyWidth = arg; },
  setKeyHeight: function(arg) { this.keyHeight = arg; },
  getKeyWidth: function(){ return this.keyWidth; },
  getKeyHeight: function(){ return this.keyHeight; },

  setStartNoteNumber: function(arg){
    this.startNoteNumber = arg;
  },
  getStartNoteNumber: function(arg){
    return this.startNoteNumber;
  },
  destroy: function(){
    this.paper.remove();
  },

  computeDimensions: function(){
    this.width = $(window).width();
    this.height = $(window).height();
    this.numCols = Math.floor(this.width / this.keyWidth);
    this.numRows = Math.floor(this.height / this.keyHeight);
  },

  getNumCols: function(){
    return this.numCols;
  },
  getNumRows: function(){
    return this.numRows;
  },

  draw: function(){
    this.drawKeys();
    this.drawOptions();
  },
  drawOptions: function(){

  },
  keyFills: {
    0: '#e60',
    1: '#e90',
    2: '#fa2',
  },
  drawKeys: function(){
    var self = this;

    for (var i = 0; i < this.numRows; i++){
      for (var k = 0; k < this.numCols; k++){
        var x = k * this.keyWidth;
        var y = i * this.keyHeight;

        if (i === self.numRows - 1) {
          if (!self.textElements) {
            self.textElements = [];
          }
          var textElt = this.paper.text(x + this.keyWidth / 2, y + this.keyHeight / 2, "");
          textElt.attr({
            'font-size': 11,
          });
          self.textElements.push(textElt);
        } else if (k === self.numCols - 1){
          if (!self.menuTextElements) {
            self.menuTextElements = [];
          }
          var textElt = this.paper.text(x + this.keyWidth / 2, y + this.keyHeight / 2, "");
          textElt.attr({
            'font-size': 10,
          });
          self.menuTextElements.push(textElt);
          // todo: replace menu text with menu images
          if (i < self.menuOptions.length) {
            textElt.attr({text: self.menuOptions[i].name});
          }
        } else {
          if (!self.keyTextElements) {
            self.keyTextElements = {};
          }
          var textElt = this.paper.text(x + this.keyWidth / 2, y + this.keyHeight / 2, "");
          textElt.attr({
            'font-size': 16,
          });
          this.keyTextElements[i + ',' + k] = textElt;
        }

        var fill, fillOpacity;
        if (i === this.numRows - 1 || k === this.numCols - 1) {
          fill = '#fff';
          fillOpacity = 0;
        } else {
          fill = this.keyFills[k % 3]
          fillOpacity = 0.7;
        }

        var noteNumber = self.positionToNoteNumber(i, k);
        var letter = MIDI.noteToKey[noteNumber];
        if (letter) {
          letter = letter.slice(0, letter.length - 1);
        }
        var key = this.paper
          .rect(x, y, this.keyWidth, this.keyHeight);

      
        key.attr({
          fill: fill,
          'fill-opacity': fillOpacity,
        }).data('fill', fill)
          .data('row', i).data('column', k);

        if (k < this.numCols - 1 && i < this.numRows - 1 && letter) {
          key.data('noteNumber', noteNumber)
            .data('letter', letter)
            .drag(self.onMove, self.onStart, self.onEnd)
            .onDragOver(self.onDragOver);
        } else  {
          var onStart = function(){};

          if (i === this.numRows - 1) {
            onStart = function(){
              var startBeat = this.data('startBeat');
              if (startBeat) {
                MIDI.Editor.setCurrentBeat(startBeat);
              }
            }
          } else {
            if (i < self.menuOptions.length && self.menuOptions[i].action) {
              onStart = self.menuOptions[i].action;
            }
          }

          key.click(onStart);
        }

        self.addKey(i, k, key);
      }
    }
  },

  addKey: function(row, col, key){
    var id = row + ',' + col;
    this.keys[id] = key;
  },

  getKey: function(row, col){
    var id = row + ',' + col;
    return this.keys[id];
  },
  getContentKey: function(col){
    return this.getKey(this.getNumRows() - 1, col);
  },


  resetKeys: function(){
    this.keys = [];
  },

  positionToNoteNumber: function(row, col){
    return this.getStartNoteNumber() + col * this.getJump() + row;
  }
}

function fixedFromCharCode (codePt) {
    if (codePt > 0xFFFF) {
        codePt -= 0x10000;
        return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF));
    }
    else {
        return String.fromCharCode(codePt);
    }
}