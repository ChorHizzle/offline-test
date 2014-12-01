
Meteor.publish('song', function(songId){
  return Songs.find(songId);
});