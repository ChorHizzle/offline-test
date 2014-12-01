
Router.route('/', function () {
  this.render('home');
});

Router.route('/song/:_id', function () {
  // todo: sync data with SongManager
  this.render('home');
}, {
  name: 'song',
});