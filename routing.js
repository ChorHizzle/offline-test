
Router.route('/', function () {
  this.render('home');
});

Router.route('/song/:_id', {
  name: 'song',
  // waitOn: function(){
  //   return Meteor.subscribe('song', this.params._id);
  // },
  // data: function(){
  //   return {song: Songs.findOne(this.params._id)};
  // },
  action: function(){
    SongManager.init(this.params._id)
    this.render();
  }
});