var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var app = express();

//DB setting
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(
  'mongodb+srv://jgam:19921019@cluster0-itx5s.mongodb.net/test?retryWrites=true&w=majority'
);
var db = mongoose.connection;
db.once('open', function() {
  console.log('DB connected girit!');
});
db.on('error', function(err) {
  console.log('DB ERROR : ', err);
});

//Other settings
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//routes
app.use('/', require('./routes/home'));

//port setting
var port = 3000;
app.listen(port, function() {
  console.log('server on! localhost:' + port);
});
