if (typeof(MIDI) === "undefined") MIDI = {};

MIDI.Editor = {
  init: function(){
    this.displayDep = new Tracker.Dependency;
    this.incrementSize = Fraction.create(1, 2); // half of a beat
    this.contentIndex = 0;
    this.setContents([]); // 1; include switching pitches; in the future, we will filter out content depending on the mode
    this.setCurrentBeat(Fraction.create(0)); // 2
    this.pastOperations = [];
    this.futureOperations = [];

    this.displayTextOnChange();
  },

  displayTextOnChange: function(){
    var self = this;
    var numCols = MIDI.GuitarGui.getNumCols();
    var numPrev = Math.ceil(numCols / 2) + 1;
    var numNext = numCols - numPrev;

    // hack
    var currentKey = MIDI.GuitarGui.getContentKey(numPrev);
    currentKey.attr({'fill': '#222', 'fill-opacity': 0.3});
    Tracker.autorun(function(){
      MIDI.GuitarGui.clearContents();
      var previousContents = self.getPreviousContents(numPrev);
      var nextContents = self.getNextContents(numNext);
      previousContents.forEach(function(content, i){
        var offset = numPrev - previousContents.length;
        MIDI.GuitarGui.displayContent(i + offset, content);
      });
      nextContents.forEach(function(content, i) {
        MIDI.GuitarGui.displayContent(i + numPrev, content);
      });
    });
  },

  setContents: function(arg) {
    this.contents = arg;
    this.displayDep.changed();
  },

  getContents: function(){
    this.displayDep.depend();
    return this.contents;
  },

  // for display purposes only;
  // not inclusive of the one that contentIndex refers to
  getPreviousContents: function(numCols) {
    var currentBeat = this.getCurrentBeat();
    var incrementSize = this.getIncrementSize();
    var contents = this.getContents();
    var contentIndex = this.getContentIndex();
    var ret = [];
    var i = contentIndex - 1;
    var beatIndex = 0;
    var filled = false;
    while (1){
      var content = contents[i];
      if (!content) {break;}

      var beat = Fraction.minus(currentBeat, Fraction.times(Fraction.create(beatIndex + 1), incrementSize));
      if (Fraction.greaterThan(beat, content.startBeat)) {
        if (filled === false) {
          ret.push({type: 'space',});
        }
        filled = false;
        beatIndex++;
      } else if (Fraction.equal(content.startBeat, beat)){
        ret.push(content);
        i--;
        filled = true;
      } else {
        i--;
      }

      if (beatIndex >= numCols ){
        break;
      }
    }
    ret.reverse();
    return ret;
  },

  getNextContents: function(numCols){
    var currentBeat = this.getCurrentBeat();
    var incrementSize = this.getIncrementSize();

    var contents = this.getContents();
    var contentIndex = this.getContentIndex();
    var ret = [];
    var i = contentIndex;
    var beatIndex = 0;
    var filled = false;
    while (1){
      var content = contents[i];
      if (!content) {break;}

      var beat = Fraction.plus(currentBeat, Fraction.times(Fraction.create(beatIndex), incrementSize));
      if (Fraction.greaterThan(content.startBeat, beat)) {
        if (filled === false) {
          // todo: put some useful chord here
          ret.push({
            type: 'space',
            startBeat: beat,
          });
        }
        filled = false;
        beatIndex++;
      } else if (Fraction.equal(content.startBeat, beat)){
        ret.push(content);
        i++;
        filled = true;
      } else {
        i++;
      }
      if (beatIndex >= numCols ){
        break;
      }
    }

    return ret;
  },

  // update contentIndex as well
  setCurrentBeat: function(arg){
    this.currentBeat = arg;
    this.updateContentIndex();
    this.displayDep.changed();
  },

  getCurrentBeat: function(){
    return this.currentBeat;
  },

  undo: function(){
    var op = this.pastOperations.pop();
    if (op) {
      this.reverseOperation(op);
    }
  },
  redo: function(){
    var op = this.futureOperations.pop();
    if (op){
      this.applyOperation(op);
    }
  },

  insert: function(newContent){
    this.applyOperation(this.createInsertOp(newContent));
  },

  // the only thing that should happen is
  // the same op being thrown between pastOperations and futureOperations
  reverseOperation: function(op){
    switch (op.name) {
      case "insert":
        this.applyUninsert(op.info);
        break;
      case "zoom":
        this.applyUnzoom(op.info);
        break;
      case "lowerPitch":
        this.higherPitch();
        break;
      case "higherPitch":
        this.lowerPitch();
        break;
      default:
        break;
    }
    this.futureOperations.push(op);
  },

  applyOperation: function(op){
    switch (op.name) {
      case "insert":
        this.applyInsert(op.info);
        break;
      case "zoom":
        this.applyZoom(op.info);
        break;
      case "lowerPitch":
        this.lowerPitch();
        break;
      case "higherPitch":
        this.higherPitch();
        break;
      default:
        break;
    }
    this.pastOperations.push(op);
  },

  getContentIndex: function(){
    return this.contentIndex;
  },

  setContentIndex: function(arg){
    this.contentIndex = arg;
  },

  getIncrementSize: function(){
    return this.incrementSize;
  },

  setIncrementSize: function(arg){
    this.incrementSize = arg;
  },

  // remove future operations when we create new things
  createInsertOp: function(newContent){
    var contents = this.getContents();
    var currentBeat = this.getCurrentBeat();
    var contentIndex = this.getContentIndex();
    var isOccupied = false;
    var oldContent = null;
    if (contentIndex < contents.length) {
      oldContent = contents[contentIndex];
      if (!Fraction.equal(oldContent.startBeat, currentBeat)){
        oldContent = null;
      }
    }

    this.futureOperations = [];
    newContent.startBeat = currentBeat; // annotate

    return {
      name: 'insert',
      info: {
        content: newContent,
        oldContent: oldContent,
        contentIndex: contentIndex,
        currentBeat: currentBeat,
      } 
    };
  },

  applyInsert: function(info){
    this.setCurrentBeat(info.currentBeat);
    var contents = this.getContents();
    if (info.oldContent) {
      contents.splice(info.contentIndex, 1, info.content);
    } else {
      contents.splice(info.contentIndex, 0, info.content);
    }
    this.setContents(contents);
    this.incrementBeat();
  },

  applyUninsert: function(info){
    this.setCurrentBeat(info.currentBeat);
    var contents = this.getContents();
    if (info.oldContent) {
      contents.splice(info.contentIndex, 1, info.oldContent);
    } else {
      contents.splice(info.contentIndex, 0, info.oldContent);
    }
    this.setContents(contents);
  },

  applyUninsert: function(info) {
    var contents = this.getContents();
    this.setCurrentBeat(info.currentBeat);

    if (info.removed) {
      contents.splice(info.contentIndex, 1, info.removed);
    } else {
      contents.splice(info.contentIndex, 1);
    }
    this.setContents(contents);
  },

  incrementBeat: function(){
    this.setCurrentBeat(Fraction.plus(this.getCurrentBeat(), this.incrementSize));
  },
  decrementBeat: function(){
    this.setCurrentBeat(Fraction.minus(this.getCurrentBeat(), this.incrementSize));
  },
  
  updateContentIndex: function(){
    var beat = this.getCurrentBeat();
    var contents = this.getContents(); 
    this.contentIndex = contents.length;
    for (var i = 0; i < contents.length; i++) {
      var content = contents[i];
      if (Fraction.gte(content.startBeat, beat)) {
        this.contentIndex = i;
        break;
      }
    }
  },

  createZoomInOp: function(){
    var s = this.getIncrementSize();
    var denom = Fraction.getDenominator(s);
    var numer = Fraction.getNumerator(s);
    if (denom > 1 || (numer === 1 && denom === 1)) {
      var newSize = Fraction.create(numer, denom + 1);
    } else {
      var newSize = Fraction.minus(s, Fraction.create(1));
    }

    // move to a good beat
    var currentBeat = this.getCurrentBeat();
    while (1) {
      var goodBeat = this.getCurrentBeat();
      var beatNumer = Fraction.getNumerator(goodBeat);
      var beatDenom = Fraction.getDenominator(goodBeat);
      var sizeDenom = Fraction.getDenominator(newSize);
      if (sizeDenom % beatDenom !== 0) {
        this.incrementBeat();
      } else {
        break;
      }
    }
    
    return {
      name: 'zoom',
      info: {
        oldIncrementSize: s,
        incrementSize: newSize,
      },
    }
  },

  createZoomOutOp: function(){
    var s = this.getIncrementSize();
    var denom = Fraction.getDenominator(s);
    var numer = Fraction.getNumerator(s);
    if (denom > 1) {
      var newSize = Fraction.create(numer, denom -1);
    } else {
      var newSize = Fraction.plus(s, Fraction.create(1));
    }

    // move to a good beat
    var currentBeat = this.getCurrentBeat();
    while (1) {
      var goodBeat = this.getCurrentBeat();
      var beatNumer = Fraction.getNumerator(goodBeat);
      var beatDenom = Fraction.getDenominator(goodBeat);
      var sizeDenom = Fraction.getDenominator(newSize);
      if (sizeDenom % beatDenom !== 0) {
        this.incrementBeat();
      } else {
        break;
      }
    }
      
    return {
      name: 'zoom',
      info: {
        oldIncrementSize: s,
        incrementSize: newSize,
        oldCurrentBeat: currentBeat,
        currentBeat: goodBeat,
      },
    }
  },

  zoomIn: function(){
    this.applyOperation(this.createZoomInOp());
  },

  zoomOut: function(){
    this.applyOperation(this.createZoomOutOp());
  },

  applyZoom: function(info){
    this.setIncrementSize(info.incrementSize);
    this.setCurrentBeat(info.currentBeat);
  },

  applyUnzoom: function(info){
    this.setIncrementSize(info.oldIncrementSize);
    this.setCurrentBeat(info.oldCurrentBeat);
  },

  lowerPitch: function(){

  },
  higherPitch: function(){

  },
}