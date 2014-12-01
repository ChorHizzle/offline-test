GuitarGui3
==========

* record all keys onDragOver in tempDict and prevDragOver
* when another key is dragged over, update
  * prevDragOver.endTime
  * see if it should be stored in dragOverDict
    * remove fill of exist dragOver in the same column
    * add fill to the new dragOver
  