
Router.route('/', function () {
  this.render('home');
});

Router.route('/song/:_id', {
  name: 'song',
  data: function(){
    return {songId: this.params._id};
  },
  action: function(){
    this.render();
  }
});